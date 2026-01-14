import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { PermisoService } from './permiso.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermisosGuard } from '../auth/guards/permiso.guard';
import { Permisos } from '../auth/decorators/permisos.decorator';

@Controller('permiso')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class PermisoController {
  constructor(private readonly permisoService: PermisoService) {}

  // 🔒 SOLO ADMIN
  @Post()
  @Permisos('gestionar_roles')
  create(@Body() dto: CreatePermisoDto) {
    return this.permisoService.create(dto);
  }

  // 🔒 SOLO ADMIN
  @Get()
  @Permisos('gestionar_roles')
  findAll() {
    return this.permisoService.findAll();
  }

  // 🔒 SOLO ADMIN
  @Get(':id')
  @Permisos('gestionar_roles')
  findOne(@Param('id') id: string) {
    return this.permisoService.findOne(id);
  }

  // 🔒 SOLO ADMIN
  @Put(':id')
  @Permisos('gestionar_roles')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePermisoDto,
  ) {
    return this.permisoService.update(id, dto);
  }

  // 🔒 SOLO ADMIN
  @Delete(':id')
  @Permisos('gestionar_roles')
  remove(@Param('id') id: string) {
    return this.permisoService.remove(id);
  }
}
