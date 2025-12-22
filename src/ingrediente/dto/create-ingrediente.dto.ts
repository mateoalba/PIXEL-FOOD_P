import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateIngredienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  unidad_medida: string;

  @IsNumber()
  stock: number;
}
