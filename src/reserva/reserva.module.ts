import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Usuario } from 'src/usuario/usuario.schema';
import { Mesa } from 'src/mesa/mesa.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Usuario, Mesa])],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
