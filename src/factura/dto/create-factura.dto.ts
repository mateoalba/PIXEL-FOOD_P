import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateFacturaDto {
  @IsNotEmpty()
  id_pedido: string;

  @IsString()
  id_metodo: string;

  @IsNumber()
  total: number;
}
