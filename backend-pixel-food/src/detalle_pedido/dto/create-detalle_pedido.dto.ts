import { IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateDetallePedidoDto {
  @IsUUID()
  @IsNotEmpty()
  id_pedido: string;

  @IsUUID()
  @IsNotEmpty()
  id_plato: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1) // Evita que pidan 0 o cantidades negativas
  cantidad: number;
}