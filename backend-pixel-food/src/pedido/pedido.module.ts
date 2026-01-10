import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { Usuario } from 'src/usuario/usuario.schema';
import { Mesa } from 'src/mesa/mesa.entity';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, Usuario, Mesa])],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
