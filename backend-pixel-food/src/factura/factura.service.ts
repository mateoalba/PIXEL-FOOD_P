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

@Injectable()
export class FacturaService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepository: Repository<Factura>,

    @InjectModel(MetodoPago.name)
    private metodoPagoModel: Model<MetodoPagoDocument>,
  ) {}

  async create(dto: CreateFacturaDto) {
    const factura = this.facturaRepository.create({
      total: dto.total,
      id_metodo: dto.id_metodo,
      pedido: { id_pedido: dto.id_pedido } as any,
    });

    return this.facturaRepository.save(factura);
  }

  async findAll() {
    const facturas = await this.facturaRepository.find({
      relations: ['pedido'],
    });

    return Promise.all(
      facturas.map(async (factura) => {
        const metodo = await this.metodoPagoModel.findOne({
          id_metodo: factura.id_metodo,
        });

        return {
          ...factura,
          metodo_pago: metodo,
        };
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
