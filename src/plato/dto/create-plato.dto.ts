import { IsString, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CreatePlatoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precio: number;

  @IsBoolean()
  disponible: boolean;

  @IsUUID()
  id_categoria: string;
}
