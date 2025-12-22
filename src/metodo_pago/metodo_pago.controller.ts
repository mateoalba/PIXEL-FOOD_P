import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MetodoPagoService } from './metodo_pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Controller('metodo_pago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  @Post()
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.metodoPagoService.create(dto);
  }

  @Get()
  findAll() {
    return this.metodoPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodoPagoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMetodoPagoDto) {
    return this.metodoPagoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodoPagoService.remove(id);
  }
}
