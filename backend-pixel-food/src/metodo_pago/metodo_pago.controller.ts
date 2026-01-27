import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Patch } from '@nestjs/common';
import { MetodoPagoService } from './metodo_pago.service';
import { CreateMetodoPagoDto } from './dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from './dto/update-metodo-pago.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('metodo_pago')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class MetodoPagoController {
  constructor(private readonly metodoPagoService: MetodoPagoService) {}

  // ✅ El GET es lo único que necesitamos para el Modal de Cobro y la Tabla
  @Get()
  @Permisos('ver_metodos_pago')
  findAll() {
    return this.metodoPagoService.findAll();
  }

  @Get(':id')
  @Permisos('ver_metodos_pago')
  findOne(@Param('id') id: string) {
    return this.metodoPagoService.findOne(id);
  }


  @Post()
  @Permisos('crear_metodos_pago')
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.metodoPagoService.create(dto);
  }

  @Patch(':id')
  @Permisos('editar_metodos_pago')
  update(@Param('id') id: string, @Body() dto: UpdateMetodoPagoDto) {
    return this.metodoPagoService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_metodos_pago')
  remove(@Param('id') id: string) {
    return this.metodoPagoService.remove(id);
  }
  
}