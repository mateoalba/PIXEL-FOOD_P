import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { IngredienteService } from './ingrediente.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('ingrediente')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class IngredienteController {
  constructor(private readonly ingredienteService: IngredienteService) {}

  @Get()
  @Permisos('ver_ingredientes')
  findAll() {
    return this.ingredienteService.findAll();
  }

  @Get(':id')
  @Permisos('ver_ingredientes')
  findOne(@Param('id') id: string) {
    return this.ingredienteService.findOne(id);
  }

  @Post()
  @Permisos('crear_ingredientes')
  create(@Body() dto: CreateIngredienteDto) {
    return this.ingredienteService.create(dto);
  }

  @Patch(':id')
  @Permisos('editar_ingredientes')
  update(@Param('id') id: string, @Body() dto: UpdateIngredienteDto) {
    return this.ingredienteService.update(id, dto);
  }



  // 📦 ACTUALIZACIÓN DE STOCK (Admin y Empleado/Chef)
  // Nueva ruta específica para el inventario
  @Patch(':id/stock')
  @Permisos('editar_stock_ingredientes')
  updateStock(@Param('id') id: string, @Body() dto: { stock: number }) {
    // Puedes usar un DTO pequeño o simplemente el objeto con stock
    return this.ingredienteService.updateStock(id, dto.stock);
  }

  @Delete(':id')
  @Permisos('eliminar_ingredientes')
  delete(@Param('id') id: string) {
    return this.ingredienteService.delete(id);
  }
}
