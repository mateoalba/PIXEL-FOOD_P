import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsUUID()
  @IsNotEmpty()
  id_usuario: string;

  @IsUUID()
  @IsOptional()
  id_mesa?: string;

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
  estado: string;
}
