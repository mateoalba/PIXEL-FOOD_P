import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sucursal } from 'src/sucursal/sucursal.entity';
import { v4 as uuid } from 'uuid';

@Entity('mesa')
export class Mesa {
  @PrimaryGeneratedColumn('uuid')
  id_mesa: string;

  @Column()
  numero: number;

  @Column()
  capacidad: number;

  @Column()
  estado: string;

  @Column()
  id_sucursal: string; // foreign key UUID

  @ManyToOne(() => Sucursal, (sucursal) => sucursal.mesas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursal;
}
