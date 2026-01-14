import { Controller, Post, Put, Body, Get, Param } from '@nestjs/common';
import { RolPermisoService } from './rol-permiso.service';
import { CreateRolPermisoDto } from './dto/create-rol-permiso.dto';
import { UpdateRolPermisoDto } from './dto/update-rol-permiso.dto';

@Controller('rol-permiso')
export class RolPermisoController {
  constructor(private readonly service: RolPermisoService) {}

  // ✅ Asignar permisos
  @Post()
  create(@Body() dto: CreateRolPermisoDto) {
    return this.service.create(dto);
  }

  // 🔄 Reemplazar permisos
  @Put()
  update(@Body() dto: UpdateRolPermisoDto) {
    return this.service.update(dto);
  }

  // 👀 Ver permisos de un rol
  @Get(':rol_id')
  findByRol(@Param('rol_id') rol_id: string) {
    return this.service.findByRol(rol_id);
  }
}
