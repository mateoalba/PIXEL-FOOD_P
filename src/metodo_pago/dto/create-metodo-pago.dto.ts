import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMetodoPagoDto {
  @IsString()
  @IsNotEmpty()
  tipo: string; // Efectivo | Tarjeta | Transferencia

  @IsString()
  descripcion: string;
}
