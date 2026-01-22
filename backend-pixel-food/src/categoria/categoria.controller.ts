import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Patch } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('categorias')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  @Permisos('crear_categorias')
  create(@Body() dto: CreateCategoriaDto) {
    return this.categoriaService.create(dto);
  }

  @Get()
  @Permisos('ver_categorias')
  findAll() {
    return this.categoriaService.findAll();
  }

  @Get(':id')
  @Permisos('ver_categorias')
  findOne(@Param('id') id: string) {
    return this.categoriaService.findOne(id);
  }

  @Patch(':id')
  @Permisos('editar_categorias')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto) {
    return this.categoriaService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_categorias')
  remove(@Param('id') id: string) {
    return this.categoriaService.remove(id);
  }
}
