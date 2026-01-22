import { Controller, Post, Get, Put, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Permisos } from 'src/auth/decorators/permisos.decorator';

@Controller('mesas')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  @Permisos('crear_mesas')
  crearMesa(@Body() dto: CreateMesaDto) {
    return this.mesaService.crearMesa(dto);
  }

  @Get()
  @Permisos('ver_mesas')
  obtenerMesas() {
    return this.mesaService.obtenerMesas();
  }

  @Get(':id')
  @Permisos('ver_mesas')
  obtenerMesaPorId(@Param('id') id: string) {
    return this.mesaService.obtenerMesaPorId(id);
  }

  @Patch(':id')
  @Permisos('editar_mesas')
  actualizarMesa(@Param('id') id: string, @Body() dto: UpdateMesaDto) {
    return this.mesaService.actualizarMesa(id, dto);
  }

  @Delete(':id')
  @Permisos('eliminar_mesas')
  eliminarMesa(@Param('id') id: string) {
    return this.mesaService.eliminarMesa(id);
  }
}
