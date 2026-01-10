import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type MetodoPagoDocument = HydratedDocument<MetodoPago>;

@Schema({ collection: 'metodos_pago', timestamps: true })
export class MetodoPago {
  @Prop({ default: uuid })
  id_metodo: string;

  @Prop({ required: true })
  tipo: string;

  @Prop()
  descripcion: string;
}

export const MetodoPagoSchema = SchemaFactory.createForClass(MetodoPago);

MetodoPagoSchema.set('toJSON', {
  virtuals: false,
  versionKey: false,
  transform: (_, ret: any) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

MetodoPagoSchema.set('id', false);




