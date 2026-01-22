import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

// Mongo
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetodoPago, MetodoPagoDocument } from 'src/metodo_pago/metodo_pago.schema';
import { Between } from 'typeorm'; // Importante para el filtro de fechas
import { Mesa } from 'src/mesa/mesa.entity';
import { Pedido } from 'src/pedido/pedido.entity';

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)private facturaRepository: Repository<Factura>,
    @InjectModel(MetodoPago.name)private metodoPagoModel: Model<MetodoPagoDocument>,
    @InjectRepository(Pedido) private pedidoRepository: Repository<Pedido>,
    @InjectRepository(Mesa) private mesaRepository: Repository<Mesa>,
  ) {}




// factura.service.ts

async create(dto: CreateFacturaDto) {
  // 1. Validar Método de Pago en MongoDB
  const metodoExiste = await this.metodoPagoModel.findOne({ id_metodo: dto.id_metodo });
  if (!metodoExiste) {
    throw new NotFoundException(`Método de pago ${dto.id_metodo} no encontrado`);
  }

  // 2. Buscar el pedido para saber qué mesa liberar
  // Necesitas tener inyectado el PedidoRepository o PedidoService
  const pedido = await this.pedidoRepository.findOne({ 
    where: { id_pedido: dto.id_pedido },
    relations: ['mesa'] 
  });

  if (!pedido) {
    throw new NotFoundException('Pedido no encontrado');
  }

  // 3. Crear la Factura en PostgreSQL
  const factura = this.facturaRepository.create({
    total: dto.total,
    id_metodo: dto.id_metodo,
    pedido: { id_pedido: dto.id_pedido } as any,
    fecha_emision: new Date(),
  });

  const facturaGuardada = await this.facturaRepository.save(factura);

  // 4. ACTUALIZACIÓN AUTOMÁTICA: Pedido y Mesa
  // Marcamos el pedido como PAGADO (o el estado que uses)
  await this.pedidoRepository.update(pedido.id_pedido, { 
    estado: 'PAGADO' 
  });

  // Si el pedido tiene una mesa asociada, la liberamos
  if (pedido.mesa) {
    await this.mesaRepository.update(pedido.mesa.id_mesa, { 
      estado: 'disponible' 
    });
  }

  return {
    ...facturaGuardada,
    metodo_pago: metodoExiste,
    mensaje: 'Factura generada, pedido cerrado y mesa liberada'
  };
}




async findAll(user: any) {
  const whereConditions: any = {};
  const rol = user.rol.toLowerCase();

  // 1. Filtro por Rol
  if (rol === 'cliente') {
    whereConditions.pedido = { id_usuario: user.id };
  }

  if (rol === 'empleado') {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setHours(23, 59, 59, 999);
    
    whereConditions.fecha_emision = Between(hoy, mañana);
  }

  // 2. Consulta a PostgreSQL
  const facturas = await this.facturaRepository.find({
    where: whereConditions,
    relations: ['pedido'],
    order: { fecha_emision: 'DESC' }
  });

  // 3. Cruce con MongoDB
  return Promise.all(
    facturas.map(async (factura) => {
      try {
        // Buscamos en Mongo por el id_metodo (que ahora será METODO_EFECTIVO, etc.)
        const metodo = await this.metodoPagoModel.findOne({
          id_metodo: factura.id_metodo,
        }).lean(); // .lean() hace la respuesta más ligera (objeto plano)

        return {
          ...factura,
          // Si no encuentra el método, devolvemos un objeto con "tipo: N/A" 
          // para que el Front no explote al intentar leer .tipo
          metodo_pago: metodo || { tipo: 'N/A' },
        };
      } catch (error) {
        console.error(`Error al cruzar método de pago para factura ${factura.id_factura}:`, error);
        return { ...factura, metodo_pago: { tipo: 'Error' } };
      }
    }),
  );
}




async findOne(id: string) {
  const factura = await this.facturaRepository.findOne({
    where: { id_factura: id },
    relations: ['pedido'],
  });

  if (!factura) {
    throw new NotFoundException('Factura no encontrada');
  }

  const metodo = await this.metodoPagoModel.findOne({
    id_metodo: factura.id_metodo,
  });

  return {
    ...factura,
    metodo_pago: metodo,
  };
}


async update(id: string, dto: UpdateFacturaDto) {
  const factura = await this.facturaRepository.findOne({
    where: { id_factura: id },
  });

  if (!factura) {
    throw new NotFoundException('Factura no encontrada');
  }

  Object.assign(factura, dto);
  return this.facturaRepository.save(factura);
}

async remove(id: string) {
  const factura = await this.facturaRepository.findOne({
    where: { id_factura: id },
  });

  if (!factura) {
    throw new NotFoundException('Factura no encontrada');
  }

  return this.facturaRepository.remove(factura);
}

}
