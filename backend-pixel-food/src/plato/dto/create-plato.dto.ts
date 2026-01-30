import { IsString, IsBoolean, IsNumber, IsUUID, IsOptional } from 'class-validator';

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

  // AÑADIMOS ESTO:
  @IsString()
  @IsOptional() // Permite que el campo no se envíe o sea null
  imagen?: string;
}