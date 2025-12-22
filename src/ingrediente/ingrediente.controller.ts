import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { IngredienteService } from './ingrediente.service';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';

@Controller('ingrediente')
export class IngredienteController {
  constructor(private readonly ingredienteService: IngredienteService) {}

  @Get()
  findAll() {
    return this.ingredienteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ingredienteService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIngredienteDto) {
    return this.ingredienteService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIngredienteDto) {
    return this.ingredienteService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.ingredienteService.delete(id);
  }
}
