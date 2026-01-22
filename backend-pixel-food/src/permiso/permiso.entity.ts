import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('permiso')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id_permiso: string;

  @Column({ unique: true })
  codigo: string;

  @Column()
  descripcion: string;
}
  