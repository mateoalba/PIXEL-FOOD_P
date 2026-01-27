import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './reserva.entity';
import { Usuario } from 'src/usuario/usuario.schema';
import { Mesa } from 'src/mesa/mesa.entity';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol } from 'src/rol/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Usuario, Mesa, Rol]),
  MongooseModule.forFeature([{ name: Usuario.name, schema: Usuario.schema }])

],
  controllers: [ReservaController],
  providers: [ReservaService],
})
export class ReservaModule {}
