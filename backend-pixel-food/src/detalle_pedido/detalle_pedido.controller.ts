import { Controller, Get, Post, Body, Param, Put, Delete, Req, Patch, UseGuards } from '@nestjs/common';
import { DetallePedidoService } from './detalle_pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle_pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle_pedido.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';


@Controller('detalle_pedido')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post()
  @Permisos('crear_detalles_pedidos')
  create(@Body() dto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(dto);
  }

  @Get()
  @Permisos('ver_detalles_pedidos')
    findAll(@Req() req) {
      // Pasamos el usuario logueado al servicio
      return this.detallePedidoService.findAll(req.user);
    }

  @Get(':id')
  @Permisos('ver_detalles_pedidos')
  findOne(@Param('id') id: string) {
    return this.detallePedidoService.findOne(id);
  }

  @Patch(':id')
  @Permisos('editar_detalles_pedidos')
  update(@Param('id') id: string, @Body() dto: any, @Req() req) {
    return this.detallePedidoService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Permisos('eliminar_detalles_pedidos')
  remove(@Param('id') id: string) {
    return this.detallePedidoService.remove(id);
  }
}
