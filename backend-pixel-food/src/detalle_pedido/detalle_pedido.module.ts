import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedido } from './detalle_pedido.entity';
import { DetallePedidoService } from './detalle_pedido.service';
import { DetallePedidoController } from './detalle_pedido.controller';
import { Plato } from 'src/plato/plato.entity';
import { Pedido } from 'src/pedido/pedido.entity';
import { AuthModule } from 'src/auth/auth.module';


@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([DetallePedido, Plato, Pedido])],
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
  exports: [DetallePedidoService], 
})
export class DetallePedidoModule {}
