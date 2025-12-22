import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn('uuid')
  id_sucursal: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 200 })
  direccion: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 100 })
  ciudad: string;

  @Column({ length: 100 })
  departamento: string;
}
