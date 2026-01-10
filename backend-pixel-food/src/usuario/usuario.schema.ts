import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ collection: 'usuarios', timestamps: true })
export class Usuario {
  @Prop({ default: uuid })
  id_usuario: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop()
  telefono: string;

  @Prop()
  direccion: string;

  @Prop({ required: true })
  contrasena: string;

  @Prop({ required: true })
  rol_id: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
