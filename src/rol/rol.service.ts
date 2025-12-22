import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
  ) {}

  findAll() {
    return this.rolRepository.find();
  }

  async findOne(id: string) {
    const rol = await this.rolRepository.findOne({ where: { id_rol: id } });
    if (!rol) {
      throw new NotFoundException('Rol no encontrado');
    }
    return rol;
  }

  create(dto: CreateRolDto) {
    const nuevoRol = this.rolRepository.create(dto);
    return this.rolRepository.save(nuevoRol);
  }

  async update(id: string, dto: UpdateRolDto) {
    const rol = await this.findOne(id);
    Object.assign(rol, dto);
    return this.rolRepository.save(rol);
  }

  async remove(id: string) {
    const rol = await this.findOne(id);
    return this.rolRepository.remove(rol);
  }
}
