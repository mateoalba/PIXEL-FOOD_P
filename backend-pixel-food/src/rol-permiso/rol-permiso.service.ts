import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermiso } from './rol-permiso.entity';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';
import { UpdateRolPermisoDto } from './dto/update-rol-permiso.dto';

@Injectable()
export class RolPermisoService {
  constructor(
    @InjectRepository(RolPermiso)
    private rolPermisoRepo: Repository<RolPermiso>,

    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,

    @InjectRepository(Permiso)
    private permisoRepo: Repository<Permiso>,
  ) {}

  // ✅ ASIGNAR permisos (primera vez)
  async create(dto: CreateRolPermisoDto) {
    const rol = await this.rolRepo.findOne({
      where: { id_rol: dto.rol_id },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const permisos = await this.permisoRepo.findByIds(dto.permisos_ids);
    if (!permisos.length)
      throw new NotFoundException('Permisos no encontrados');

    const relaciones = permisos.map((permiso) =>
      this.rolPermisoRepo.create({ rol, permiso }),
    );

    return this.rolPermisoRepo.save(relaciones);
  }

  // 🔄 REEMPLAZAR permisos (update real)
  async update(dto: UpdateRolPermisoDto) {
    const rol = await this.rolRepo.findOne({
      where: { id_rol: dto.rol_id },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    // 1️⃣ eliminar permisos actuales
    await this.rolPermisoRepo.delete({ rol });

    // 2️⃣ insertar nuevos permisos
    const permisos = await this.permisoRepo.findByIds(dto.permisos_ids);
    if (!permisos.length)
      throw new NotFoundException('Permisos no encontrados');

    const nuevasRelaciones = permisos.map((permiso) =>
      this.rolPermisoRepo.create({ rol, permiso }),
    );

    return this.rolPermisoRepo.save(nuevasRelaciones);
  }

  // 👀 ver permisos por rol (útil para debug)
  async findByRol(rol_id: string) {
    return this.rolPermisoRepo.find({
      where: { rol: { id_rol: rol_id } },
    });
  }
}
