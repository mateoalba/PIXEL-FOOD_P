import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetodoPagoController } from './metodo_pago.controller';
import { MetodoPagoService } from './metodo_pago.service';
import { MetodoPago, MetodoPagoSchema } from './metodo_pago.schema';
import { MetodoPagoSeedService } from './metodo_pago.seed';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MetodoPago.name, schema: MetodoPagoSchema },
    ]),
  ],
  controllers: [MetodoPagoController],
  providers: [MetodoPagoService, MetodoPagoSeedService],
  exports: [MetodoPagoService],
})
export class MetodoPagoModule {}
