import { IsInt, IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMesaDto {
  @IsInt()
  numero: number;

  @IsInt()
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  estado: string;

  @IsUUID()
  id_sucursal: string;
}
