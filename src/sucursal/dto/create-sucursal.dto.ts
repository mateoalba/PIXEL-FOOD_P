import { IsString } from 'class-validator';

export class CreateSucursalDto {
  @IsString()
  nombre: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;
}
