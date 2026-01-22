import { ForbiddenException, Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Plato } from '../plato/plato.entity';
import { DetallePedido } from '../detalle_pedido/detalle_pedido.entity';
import { Mesa } from 'src/mesa/mesa.entity';

@Injectable()
export class PedidoService {
  mesaRepository: any;
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    // Inyectamos DataSource para las transacciones
    private dataSource: DataSource,
  ) {}



async create(dto: CreatePedidoDto, user: any) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Crear la cabecera del pedido
    const nuevoPedido = queryRunner.manager.create(Pedido, {
      ...dto,
      id_usuario: user.id, 
      fecha: new Date(),
      estado: 'PENDIENTE',
    });
    const pedidoGuardado = await queryRunner.manager.save(nuevoPedido);

    // 2. ACTUALIZAR ESTADO DE LA MESA (Si aplica)
    if (dto.id_mesa) {
      const updateResult = await queryRunner.manager.update(Mesa, dto.id_mesa, { 
        estado: 'Ocupada' 
      });

      if (updateResult.affected === 0) {
        throw new NotFoundException(`La mesa con ID ${dto.id_mesa} no existe`);
      }
      console.log(`Mesa ${dto.id_mesa} marcada como Ocupada`);
    }

    // 3. Procesar items, stock y recetas
    for (const item of dto.items) {
      const plato = await queryRunner.manager.findOne(Plato, {
        where: { id_plato: item.id_plato },
        relations: ['recetas', 'recetas.ingrediente'],
      });

      if (!plato) throw new NotFoundException(`Plato ${item.id_plato} no existe`);

      // Descontar cada ingrediente de la receta
      for (const receta of plato.recetas) {
        const ingrediente = receta.ingrediente;
        const totalRequerido = receta.cantidad * item.cantidad;

        if (ingrediente.stock < totalRequerido) {
          throw new BadRequestException(`Stock insuficiente de ${ingrediente.nombre}`);
        }

        ingrediente.stock -= totalRequerido;
        await queryRunner.manager.save(ingrediente);
      }

      // 4. Crear el detalle del pedido
      const detalle = queryRunner.manager.create(DetallePedido, {
        id_pedido: pedidoGuardado.id_pedido,
        id_plato: plato.id_plato,
        cantidad: item.cantidad,
        subtotal: Number(plato.precio) * item.cantidad,
      });
      await queryRunner.manager.save(detalle);
    }

    // Si todo salió bien, confirmamos los cambios
    await queryRunner.commitTransaction();
    return pedidoGuardado;

  } catch (error) {
    // Si hay cualquier error (falta de stock, mesa inexistente, etc), 
    // se revierte TODO (el pedido, el stock y el estado de la mesa)
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    // Liberamos el queryRunner
    await queryRunner.release();
  }
}




async findAll(user: any) {
  // Si es admin o empleado, ve todo
  if (user.rol.toLowerCase() !== 'cliente') {
    return await this.pedidoRepository.find({
      relations: ['detalles', 'mesa'], // trae las relaciones necesarias
      order: { fecha: 'DESC' }
    });
  }

  // Si es CLIENTE, filtramos por su id_usuario
  return await this.pedidoRepository.find({
    where: { id_usuario: user.id }, // 👈 Filtro clave
    relations: ['detalles', 'mesa'],
    order: { fecha: 'DESC' }
  });
}

  async findOne(id: string) {
      const pedido = await this.pedidoRepository.findOne({
        where: { id_pedido: id },
        relations: ['mesa', 'detalles', 'detalles.plato'],
      });
      if (!pedido) throw new NotFoundException('Pedido no encontrado');
      return pedido;
    }

async update(id: string, dto: UpdatePedidoDto, user: any) {
  // 1. Buscamos el pedido (ASEGÚRATE de incluir id_mesa en la búsqueda)
  const pedido = await this.pedidoRepository.findOne({
    where: { id_pedido: id },
    // Si id_mesa es una relación, cámbialo por relations: ['mesa']
  });

  if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);

  // 2. Aplicamos los cambios del DTO según el rol
  if (user.rol.toLowerCase() === 'empleado') {
    if (dto.estado) {
      pedido.estado = dto.estado;
    }
  } else {
    // El Admin puede editar todo
    Object.assign(pedido, dto);
  }

  // 3. LÓGICA DE LIBERACIÓN DE MESA
  // 🛡️ IMPORTANTE: Verifica cómo se llama el campo en tu entidad Pedido. 
  // Si es una relación, usa pedido.mesa?.id_mesa
  const idMesaEfectivo = pedido.id_mesa; 

  if (pedido.estado === 'ENTREGADO' && idMesaEfectivo) {
    try {
      await this.mesaRepository.update(idMesaEfectivo, { 
        estado: 'Libre' 
      });
      console.log(`Mesa ${idMesaEfectivo} liberada automáticamente.`);
    } catch (error) {
      // Evitamos que el error de la mesa tumbe toda la transacción del pedido
      console.error("Error al liberar la mesa:", error.message);
    }
  }

  // 4. Guardar cambios en el pedido
  try {
    return await this.pedidoRepository.save(pedido);
  } catch (error) {
    console.error("Error al guardar pedido:", error.message);
    throw new InternalServerErrorException('Error en la base de datos al guardar el pedido');
  }
}





async remove(id: string, user: any) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Buscamos el pedido usando 'detalles' que es el nombre en tu Entity
    const pedido = await queryRunner.manager.findOne(Pedido, {
      where: { id_pedido: id },
      relations: [
        'detalles', 
        'detalles.plato', 
        'detalles.plato.recetas', 
        'detalles.plato.recetas.ingrediente'
      ]
    });

    if (!pedido) throw new NotFoundException(`Pedido ${id} no encontrado`);

    // 2. Seguridad: El cliente solo anula si está PENDIENTE
    if (user.rol.toLowerCase() === 'cliente' && pedido.estado !== 'PENDIENTE') {
      throw new ForbiddenException('El pedido ya está en proceso.');
    }

    // 3. DEVOLVER STOCK (Si no estaba ya cancelado)
    if (pedido.estado !== 'CANCELADO' && pedido.detalles) {
      for (const detalle of pedido.detalles) {
        if (detalle.plato?.recetas) {
          for (const receta of detalle.plato.recetas) {
            const ingrediente = receta.ingrediente;
            // Calculamos cuánto devolver: (cantidad por receta) * (cantidad de platos pedidos)
            const cantidadADevolver = Number(receta.cantidad) * Number(detalle.cantidad);

            // Sumamos al stock del ingrediente
            ingrediente.stock = Number(ingrediente.stock) + cantidadADevolver;
            await queryRunner.manager.save(ingrediente);
          }
        }
      }
    }

    // 4. LIBERAR LA MESA
    if (pedido.id_mesa) {
      await queryRunner.manager.update(Mesa, pedido.id_mesa, { 
        estado: 'Libre' 
      });
    }

    // 5. CAMBIAR ESTADO A CANCELADO
    pedido.estado = 'CANCELADO';
    await queryRunner.manager.save(pedido);

    await queryRunner.commitTransaction();
    return { message: 'Pedido anulado, stock devuelto y mesa liberada' };

  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

}