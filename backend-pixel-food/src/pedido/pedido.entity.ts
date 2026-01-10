import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from 'src/usuario/usuario.schema';
import { Mesa } from 'src/mesa/mesa.entity';

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn('uuid')
  id_pedido: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ length: 20 })
  tipo: string; // 'en_mesa' | 'para_llevar'

  @Column()
  id_usuario: string;


  @Column({ nullable: true })
  id_mesa: string | null;

  @ManyToOne(() => Mesa, { nullable: true })
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa | null;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ length: 20 })
  estado: string; // 'pendiente', 'preparando', 'entregado', 'pagado'
}
