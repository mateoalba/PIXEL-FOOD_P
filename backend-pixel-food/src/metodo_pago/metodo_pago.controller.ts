import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MetodoPagoService } from './metodo_pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';

@Controller('metodo_pago')
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  // ✅ El GET es lo único que necesitamos para el Modal de Cobro y la Tabla
  @Get()
  findAll() {
    return this.metodoPagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metodoPagoService.findOne(id);
  }

  /* 🚫 BLOQUEADOS TEMPORALMENTE 
     Los comentamos para que nadie pueda "ensuciar" el catálogo desde Postman.
     La gestión se hace exclusivamente desde el MetodoPagoSeedService.
  */

  /*
  @Post()
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.metodoPagoService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMetodoPagoDto) {
    return this.metodoPagoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metodoPagoService.remove(id);
  }
  */
}