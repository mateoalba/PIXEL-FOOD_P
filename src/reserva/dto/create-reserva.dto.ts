import { IsNotEmpty, IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateReservaDto {
  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsUUID()
  id_mesa: string;

  @IsNumber()
  numero_personas: number;

  @IsString()
  estado: string;
}
