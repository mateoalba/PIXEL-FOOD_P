import {Controller,Get,Post,Body,Param,Put,Delete,Req,UseGuards,Patch,} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Permisos } from 'src/auth/decorators/permisos.decorator';
import { PermisosGuard } from 'src/auth/guards/permiso.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('factura')
@UseGuards(JwtAuthGuard, PermisosGuard)
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  @Permisos('crear_facturas')
  create(@Body() dto: CreateFacturaDto) {
    return this.facturaService.create(dto);
  }

  @Get()
  @Permisos('ver_facturas')
  findAll(@Req() req: any) {
    // req.user es donde Passport o tu Guard inyecta al usuario logueado
    return this.facturaService.findAll(req.user);
  }

    @Get(':id')
    @Permisos('ver_facturas')
    findOne(@Param('id') id: string) {
    return this.facturaService.findOne(id);
    }

  
@Patch(':id')
@Permisos('editar_facturas')
update(
  @Param('id') id: string,
  @Body() dto: UpdateFacturaDto,
) {
  return this.facturaService.update(id, dto);
}


@Delete(':id')
@Permisos('eliminar_facturas')
remove(@Param('id') id: string) {
  return this.facturaService.remove(id);
}
}
