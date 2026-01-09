import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
  ) {}

  async create(dto: CreatePedidoDto) {
    const pedido = this.pedidoRepository.create(dto);
    return await this.pedidoRepository.save(pedido);
  }

  async findAll() {
    return await this.pedidoRepository.find({
      relations: ['mesa'], // 👈 SOLO mesa
    });
  }

  async findOne(id: string) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id_pedido: id },
      relations: ['mesa'], // 👈 SOLO mesa
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async update(id: string, dto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);
    Object.assign(pedido, dto);
    return await this.pedidoRepository.save(pedido);
  }

  async remove(id: string) {
    const pedido = await this.findOne(id);
    return this.pedidoRepository.remove(pedido);
  }
}
