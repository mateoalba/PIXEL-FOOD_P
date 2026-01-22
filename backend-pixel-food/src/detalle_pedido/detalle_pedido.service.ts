import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from './detalle_pedido.entity';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { Pedido } from 'src/pedido/pedido.entity';
import { Plato } from 'src/plato/plato.entity';

@Injectable()
export class DetallePedidoService {
  constructor(
    @InjectRepository(DetallePedido)
    private readonly detalleRepo: Repository<DetallePedido>,
    
    @InjectRepository(Plato)
    private readonly platoRepo: Repository<Plato>,
    
    @InjectRepository(Pedido)
    private readonly pedidoRepo: Repository<Pedido>,
  ) {}

  // ✅ Obtener todos con filtro de seguridad por Rol
async findAll(user: any) {
  const query = this.detalleRepo.createQueryBuilder('detalle')
    .leftJoinAndSelect('detalle.pedido', 'pedido') // Asegúrate que 'pedido' exista en la entidad DetallePedido
    .leftJoinAndSelect('detalle.plato', 'plato');  // Asegúrate que 'plato' exista en la entidad DetallePedido

  if (user.rol.toLowerCase() === 'cliente') {
    // 💡 IMPORTANTE: Verifica cómo se llama la columna del usuario en tu tabla PEDIDO.
    // Si en la base de datos es 'id_usuario', usa 'pedido.id_usuario'
    query.where('pedido.id_usuario = :userId', { userId: user.id });
  }

  return await query.getMany();
}

  async findOne(id: string) {
    const detalle = await this.detalleRepo.findOne({
      where: { id_detalle: id },
      relations: ['pedido', 'plato'],
    });
    if (!detalle) throw new NotFoundException(`Detalle con ID ${id} no existe`);
    return detalle;
  }

  // ✅ Crear: Ahora valida que el Pedido exista y esté PENDIENTE
  async create(dto: CreateDetallePedidoDto) {
    // 1. Validar que el pedido exista y ver su estado
    const pedido = await this.pedidoRepo.findOne({ where: { id_pedido: dto.id_pedido } });
    if (!pedido) throw new NotFoundException('El pedido no existe');
    
    if (pedido.estado.toLowerCase() !== 'pendiente') {
      throw new ForbiddenException('No se pueden agregar platos a un pedido que no esté pendiente');
    }

    // 2. Buscar el plato para obtener el precio real
    const plato = await this.platoRepo.findOne({ where: { id_plato: dto.id_plato } });
    if (!plato) throw new NotFoundException(`El plato con ID ${dto.id_plato} no existe`);

    // 3. Calcular subtotal en el servidor (Seguro)
    const subtotalCalculado = Number(plato.precio) * dto.cantidad;

    // 4. Guardar
    const nuevoDetalle = this.detalleRepo.create({
      ...dto,
      subtotal: subtotalCalculado
    });

    return await this.detalleRepo.save(nuevoDetalle);
  }

  // ✅ Update: Solo permite editar si el pedido está PENDIENTE (excepto Admin)
  async update(id: string, dto: UpdateDetallePedidoDto, user: any) {
    const detalle = await this.findOne(id);

    if (user.rol.toLowerCase() !== 'admin') {
      const estado = detalle.pedido.estado.toLowerCase();
      if (estado !== 'pendiente') {
        throw new ForbiddenException(
          `No puedes modificar este plato porque el pedido está: ${estado}`
        );
      }
    }

    // Si cambian la cantidad, recalculamos el subtotal
    if (dto.cantidad) {
      const precio = Number(detalle.plato.precio);
      detalle.subtotal = precio * dto.cantidad;
    }

    Object.assign(detalle, dto);
    return await this.detalleRepo.save(detalle);
  }

  async remove(id: string) {
    const detalle = await this.findOne(id);
    await this.detalleRepo.remove(detalle);
    return detalle;
  }
}