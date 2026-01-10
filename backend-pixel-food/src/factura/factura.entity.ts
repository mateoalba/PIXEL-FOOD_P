// src/factura/factura.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from 'src/pedido/pedido.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id_factura: string;

  @Column()
  id_metodo: string; // 🔴 viene de Mongo (NO relación)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_emision: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  // ✅ Relación solo con Pedido (Postgres)
  @ManyToOne(() => Pedido)
  @JoinColumn({ name: 'id_pedido' })
  pedido: Pedido;
}
