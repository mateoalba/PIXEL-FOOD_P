import { Controller, Get, Post, Put, Delete, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('sucursal')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Get()
  @Permisos('ver_sucursales')
  findAll() {
    return this.sucursalService.findAll();
  }

  @Get(':id')
  @Permisos('ver_sucursales')
  findOne(@Param('id') id: string) {
    return this.sucursalService.findOne(id);
  }

  @Post()
  @Permisos('crear_sucursales')
  create(@Body() dto: CreateSucursalDto) {
    return this.sucursalService.create(dto);
  }

  @Patch(':id')
  @Permisos('editar_sucursales')
  update(@Param('id') id: string, @Body() dto: UpdateSucursalDto) {
    return this.sucursalService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_sucursales')
  remove(@Param('id') id: string) {
    return this.sucursalService.remove(id);
  }
}
