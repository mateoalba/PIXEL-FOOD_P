import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('reserva')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @Permisos('crear_reservas')
  create(@Body() dto: CreateReservaDto) {
    return this.reservaService.create(dto);
  }

  @Get()
  @Permisos('ver_reservas')
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id')
  @Permisos('ver_reservas')
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(id);
  }

  @Patch(':id')
  @Permisos('editar_reservas')
  update(@Param('id') id: string, @Body() dto: UpdateReservaDto) {
    return this.reservaService.update(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_reservas')
  remove(@Param('id') id: string) {
    return this.reservaService.remove(id);
  }
}
