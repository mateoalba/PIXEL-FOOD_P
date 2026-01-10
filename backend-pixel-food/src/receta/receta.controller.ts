import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';

@Controller('recetas')
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Post()
  create(@Body() dto: CreateRecetaDto) {
    return this.recetaService.create(dto);
  }

  @Get()
  findAll() {
    return this.recetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recetaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRecetaDto) {
    return this.recetaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recetaService.remove(id);
  }
}
