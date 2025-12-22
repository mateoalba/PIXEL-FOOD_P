import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetallePedido } from './detalle_pedido.entity';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';

@Injectable()
export class DetallePedidoService {

  constructor(
    @InjectRepository(DetallePedido)
    private detalleRepo: Repository<DetallePedido>,
  ) {}

  async create(dto: CreateDetallePedidoDto) {
    const detalle = this.detalleRepo.create(dto);
    return await this.detalleRepo.save(detalle);
  }

  async findAll() {
    return await this.detalleRepo.find({
      relations: ['pedido', 'plato'],
    });
  }

  async findOne(id: string) {
    const detalle = await this.detalleRepo.findOne({
      where: { id_detalle: id },
      relations: ['pedido', 'plato'],
    });

    if (!detalle) {
      throw new NotFoundException(`DetallePedido con ID ${id} no existe`);
    }

    return detalle;
  }

  async update(id: string, dto: UpdateDetallePedidoDto) {
    const detalle = await this.findOne(id);
    Object.assign(detalle, dto);
    return await this.detalleRepo.save(detalle);
  }

  async remove(id: string) {
    const detalle = await this.findOne(id);
    await this.detalleRepo.remove(detalle);
    return detalle;
  }
}
