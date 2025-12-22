import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Mesa } from 'src/mesa/mesa.entity';

@Entity('reserva')
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_reserva: Date;

  @Column()
  numero_personas: number;

  @Column()
  estado: string;

 
  @Column()
  id_usuario: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;


  @Column({ nullable: true })
  id_mesa: string;

  @ManyToOne(() => Mesa, { nullable: true })
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;
}
