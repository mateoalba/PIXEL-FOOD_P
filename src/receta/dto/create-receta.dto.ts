import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRecetaDto {
  @IsString()
  @IsNotEmpty()
  id_plato: string;     

  @IsString()
  @IsNotEmpty()
  id_ingrediente: string; 

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}
