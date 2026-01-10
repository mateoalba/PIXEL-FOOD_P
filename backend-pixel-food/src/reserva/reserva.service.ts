import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async create(dto: CreateReservaDto) {
    const reserva = this.reservaRepository.create(dto);
    return this.reservaRepository.save(reserva);
  }

  async findAll() {
    return this.reservaRepository.find({
      relations: ['mesa'], // ✅ SOLO mesa
    });
  }

  async findOne(id: string) {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva: id },
      relations: ['mesa'],
    });

    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async update(id: string, dto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    Object.assign(reserva, dto);
    return this.reservaRepository.save(reserva);
  }

  async remove(id: string) {
    const reserva = await this.findOne(id);
    return this.reservaRepository.remove(reserva);
  }
}
