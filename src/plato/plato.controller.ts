import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Controller('platos')
export class PlatoController {
  constructor(private readonly platoService: PlatoService) {}

  @Post()
  create(@Body() dto: CreatePlatoDto) {
    return this.platoService.create(dto);
  }

  @Get()
  findAll() {
    return this.platoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlatoDto) {
    return this.platoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.platoService.remove(id);
  }
}
