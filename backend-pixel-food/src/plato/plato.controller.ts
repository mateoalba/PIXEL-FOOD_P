import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('platos')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Post()
  @Permisos('crear_platos')
  create(@Body() dto: CreatePlatoDto) {
    return this.platoService.create(dto);
  }

  @Get()
  @Permisos('ver_platos')
  findAll() {
    return this.platoService.findAll();
  }

  @Get(':id')
  @Permisos('ver_platos')
  findOne(@Param('id') id: string) {
    return this.platoService.findOne(id);
  }

  @Patch(':id')
  @Permisos('editar_platos')
  update(@Param('id') id: string, @Body() dto: UpdatePlatoDto) {
    return this.platoService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_platos')
  delete(@Param('id') id: string) {
    return this.platoService.remove(id);
  }
}
