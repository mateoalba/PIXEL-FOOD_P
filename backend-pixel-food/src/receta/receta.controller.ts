import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('recetas')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Post()
  @Permisos('crear_recetas') 
  create(@Body() dto: CreateRecetaDto) {
    return this.recetaService.create(dto);
  }

  @Get()
  @Permisos('ver_recetas')
  findAll() {
    return this.recetaService.findAll();
  }

  @Get(':id')
  @Permisos('ver_recetas')
  findOne(@Param('id') id: string) {
    return this.recetaService.findOne(id);
  }


  @Get('plato/:id_plato') // Coincide con tu recetasApi.getByPlato
  @Permisos('ver_recetas')
  findByPlato(@Param('id_plato') id_plato: string) {
  return this.recetaService.findByPlato(id_plato);
  }

  @Patch(':id')
  @Permisos('editar_recetas')
  update(@Param('id') id: string, @Body() dto: UpdateRecetaDto) {
    return this.recetaService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_recetas')
  remove(@Param('id') id: string) {
    return this.recetaService.remove(id);
  }
}
