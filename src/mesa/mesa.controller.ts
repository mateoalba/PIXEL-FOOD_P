import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';

@Controller('mesas')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  crearMesa(@Body() dto: CreateMesaDto) {
    return this.mesaService.crearMesa(dto);
  }

  @Get()
  obtenerMesas() {
    return this.mesaService.obtenerMesas();
  }

  @Get(':id')
  obtenerMesaPorId(@Param('id') id: string) {
    return this.mesaService.obtenerMesaPorId(id);
  }

  @Put(':id')
  actualizarMesa(@Param('id') id: string, @Body() dto: UpdateMesaDto) {
    return this.mesaService.actualizarMesa(id, dto);
  }

  @Delete(':id')
  eliminarMesa(@Param('id') id: string) {
    return this.mesaService.eliminarMesa(id);
  }
}
