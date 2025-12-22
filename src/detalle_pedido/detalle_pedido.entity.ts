import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Pedido } from 'src/pedido/pedido.entity';
import { Plato } from 'src/plato/plato.entity';

@Entity('detalle_pedido')
export class DetallePedido {

  @PrimaryGeneratedColumn('uuid')
  id_detalle: string;

  @Column()
  id_pedido: string;

  @ManyToOne(() => Pedido, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;

  @Column()
  id_plato: string;

  @ManyToOne(() => Plato)
  @JoinColumn({ name: 'id_plato' })
  plato: Plato;

  @Column('int')
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;
}
