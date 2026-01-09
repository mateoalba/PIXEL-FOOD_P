// src/factura/dto/update-factura.dto.ts
import { IsOptional, IsUUID, IsNumber } from 'class-validator';

export class UpdateFacturaDto {
  @IsOptional()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsUUID()
  id_metodo?: string;

  @IsOptional()
  @IsUUID()
  id_pedido?: string;
}
