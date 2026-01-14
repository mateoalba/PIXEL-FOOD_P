import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from './permiso.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Injectable()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  // 🔹 CREAR
  async create(dto: CreatePermisoDto) {
    const existe = await this.permisoRepo.findOne({
      where: { codigo: dto.codigo },
    });

    if (existe) {
      throw new BadRequestException('El permiso ya existe');
    }

    const permiso = this.permisoRepo.create(dto);
    return this.permisoRepo.save(permiso);
  }

  // 🔹 LISTAR TODOS
  async findAll() {
    return this.permisoRepo.find();
  }

  // 🔹 BUSCAR POR ID
  async findOne(id: string) {
    return this.permisoRepo.findOne({
      where: { id_permiso: id },
    });
  }

  // 🔹 ACTUALIZAR
  async update(id: string, dto: UpdatePermisoDto) {
    await this.permisoRepo.update(id, dto);
    return this.findOne(id);
  }

  // 🔹 ELIMINAR
  async remove(id: string) {
    return this.permisoRepo.delete(id);
  }
}
