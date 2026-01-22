import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFacturaDto {
  @IsNotEmpty()
  @IsString()
  id_pedido: string;

  @IsString()
  @IsNotEmpty()
  id_metodo: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  // ✅ AGREGA ESTO:
  @IsString()
  @IsOptional() 
  referencia_pago?: string;
}
