import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DetallePedidoService } from './detalle_pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';


@Controller('detalle_pedido')
export class DetallePedidoController {

  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post()
  create(@Body() dto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(dto);
  }

  @Get()
  findAll() {
    return this.detallePedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detallePedidoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDetallePedidoDto) {
    return this.detallePedidoService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detallePedidoService.remove(id);
  }
}
