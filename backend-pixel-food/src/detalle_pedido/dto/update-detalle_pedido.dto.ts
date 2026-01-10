import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDetallePedidoDto {
  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  subtotal?: number;
}
