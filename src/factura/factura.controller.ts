import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Controller('factura')
export class FacturaController {
  constructor(private readonly facturaService: FacturaService) {}

  @Post()
  create(@Body() dto: CreateFacturaDto) {
    return this.facturaService.create(dto);
  }

  @Get()
  findAll() {
    return this.facturaService.findAll();
  }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.facturaService.findOne(id);
    }

  // 🔵 PUT
@Put(':id')
update(
  @Param('id') id: string,
  @Body() dto: UpdateFacturaDto,
) {
  return this.facturaService.update(id, dto);
}

// 🔴 DELETE
@Delete(':id')
remove(@Param('id') id: string) {
  return this.facturaService.remove(id);
}
}
