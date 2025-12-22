import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsUUID()
  @IsNotEmpty()
  id_pedido: string;

  @IsUUID()
  @IsNotEmpty()
  id_plato: string;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;
}
