import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MetodoPago } from './metodo_pago.schema';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Injectable()
export class MetodoPagoService {
  constructor(
    @InjectModel(MetodoPago.name)
    private metodoPagoModel: Model<MetodoPago>,
  ) {}

  async create(dto: CreateMetodoPagoDto) {
    const nuevo = new this.metodoPagoModel(dto);
    return await nuevo.save();
  }

  async findAll() {
    return await this.metodoPagoModel.find();
  }

  async findOne(id: string) {
    const metodo = await this.metodoPagoModel.findOne({ id_metodo: id });

    if (!metodo) {
      throw new NotFoundException('Método de pago no encontrado');
    }

    return metodo;
  }

  async update(id: string, dto: UpdateMetodoPagoDto) {
    const updated = await this.metodoPagoModel.findOneAndUpdate(
      { id_metodo: id },
      dto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Método de pago no encontrado');
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.metodoPagoModel.findOneAndDelete({
      id_metodo: id,
    });

    if (!deleted) {
      throw new NotFoundException('Método de pago no encontrado');
    }

    return {
      message: 'Método de pago eliminado correctamente',
      eliminado: deleted,
    };
  }
}
