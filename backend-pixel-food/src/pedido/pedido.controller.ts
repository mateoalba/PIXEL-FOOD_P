import { Controller, Post, Get, Put, Patch, Delete, Body, Param, Request, UseGuards, Req } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('pedido')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @Permisos('crear_pedidos') // Tu permiso
  create(@Body() dto: CreatePedidoDto, @Request() req) {
    return this.pedidoService.create(dto, req.user);
  }

  @Get()
  @Permisos('ver_pedidos')
  // Agregamos @Req() para obtener al usuario del request
  findAll(@Req() req: any) {
    // req.user contiene el id y el rol que vienen del token JWT
    return this.pedidoService.findAll(req.user);
  }

  @Get(':id')
  @Permisos('ver_pedidos') // Tu permiso
  findOne(@Param('id') id: string) {
    return this.pedidoService.findOne(id);
  }

  @Patch(':id')
  @Permisos('editar_pedidos') // Tu permiso para Admin y Empleado
  update(@Param('id') id: string, @Body() dto: UpdatePedidoDto, @Request() req) {
    return this.pedidoService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Permisos('cancelar_pedidos') // Tu permiso para Admin y Cliente
  remove(@Param('id') id: string, @Request() req) {
    return this.pedidoService.remove(id, req.user);
  }
}