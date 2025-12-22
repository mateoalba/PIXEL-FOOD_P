import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  findAll() {
    return this.sucursalRepository.find({
      relations: ['mesas'],
    });
  }

  async findOne(id: string) {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id_sucursal: id },
      relations: ['mesas'],
    });

    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    return sucursal;
  }

  create(dto: CreateSucursalDto) {
    const newData = this.sucursalRepository.create(dto);
    return this.sucursalRepository.save(newData);
  }

  async update(id: string, dto: UpdateSucursalDto) {
    const sucursal = await this.findOne(id);
    Object.assign(sucursal, dto);
    return this.sucursalRepository.save(sucursal);
  }

  async remove(id: string) {
    const sucursal = await this.findOne(id);
    return this.sucursalRepository.remove(sucursal);
  }
}
