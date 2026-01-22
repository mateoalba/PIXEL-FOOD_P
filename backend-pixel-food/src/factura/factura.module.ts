// src/factura/factura.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Factura } from './factura.entity';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';

// Mongo
import { MongooseModule } from '@nestjs/mongoose';
import { MetodoPago, MetodoPagoSchema } from 'src/metodo_pago/metodo_pago.schema';
import { Pedido } from 'src/pedido/pedido.entity';
import { Mesa } from 'src/mesa/mesa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factura, Pedido, Mesa]),
    MongooseModule.forFeature([{ name: MetodoPago.name, schema: MetodoPagoSchema },
    ]),
  ],
  controllers: [FacturaController],
  providers: [FacturaService],
})
export class FacturaModule {}
