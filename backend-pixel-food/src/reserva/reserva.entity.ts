import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Mesa } from 'src/mesa/mesa.entity';

@Entity('reserva')
@Unique(['id_mesa', 'fecha_reserva', 'hora'])
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id_reserva: string;

  @Column({ type: 'timestamp' })
  fecha_reserva: Date;

  @Column()
  hora: string;

  @Column()
  numero_personas: number;

  @Column({ default: 'CONFIRMADA' })
  estado: string;

  // Cambiamos a nullable: true para que no explote si es registro manual
  @Column({ nullable: true }) 
  id_usuario: string;

  // NUEVA COLUMNA: Para guardar nombre/correo/tel de clientes manuales
  // Usamos 'jsonb' (Postgres) para guardar el objeto completo del cliente
  @Column({ type: 'jsonb', nullable: true })
  datos_cliente: { nombre: string; correo: string; telefono?: string };

  @Column()
  id_sucursal: string;

  @Column({ nullable: true })
  id_mesa: string;

  @ManyToOne(() => Mesa, { nullable: true })
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;
}