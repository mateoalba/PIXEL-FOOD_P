import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Plato } from 'src/plato/plato.entity';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn('uuid', { name: 'id_categoria' })
  id_categoria: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @OneToMany(() => Plato, plato => plato.categoria)
  platos: Plato[];
}
