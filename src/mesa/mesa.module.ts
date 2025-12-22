import { Module } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { MesaController } from './mesa.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './mesa.entity';
import { Sucursal } from 'src/sucursal/sucursal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa, Sucursal])],
  controllers: [MesaController],
  providers: [MesaService],
})
export class MesaModule {}
