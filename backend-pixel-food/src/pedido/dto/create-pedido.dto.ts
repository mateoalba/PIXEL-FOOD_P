import { IsNotEmpty, IsString, IsNumber, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Definimos la estructura de cada plato dentro del pedido
class PedidoItemDto {
  @IsUUID()
  @IsNotEmpty()
  id_plato: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;
}

export class CreatePedidoDto {
  @IsString()
  @IsNotEmpty()
  tipo: string; // Ejemplo: 'LOCAL', 'DELIVERY', 'PARA_LLEVAR'

  @IsUUID()
  @IsOptional()
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto) // 👈 Esto es clave para que NestJS entienda la lista de platos
  items: PedidoItemDto[];
}