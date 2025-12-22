import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MetodoPagoController } from './metodo_pago.controller';
import { MetodoPagoService } from './metodo_pago.service';
import { MetodoPago, MetodoPagoSchema } from './metodo_pago.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MetodoPago.name, schema: MetodoPagoSchema },
    ]),
  ],
  controllers: [MetodoPagoController],
  providers: [MetodoPagoService],
  exports: [MetodoPagoService],
})
export class MetodoPagoModule {}
