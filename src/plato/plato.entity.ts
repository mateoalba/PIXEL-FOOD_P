import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from 'src/categoria/categoria.entity';
import { Receta } from 'src/receta/receta.entity';

@Entity('plato')
export class Plato {

  @PrimaryGeneratedColumn('uuid', { name: 'id_plato' })
  id_plato: string;

  @Column()
  nombre: string;

  @Column('text')
  descripcion: string;

  @Column('decimal')
  precio: number;

  @Column()
  disponible: boolean;

  @ManyToOne(() => Categoria, categoria => categoria.platos, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  categoria: Categoria;

  @OneToMany(() => Receta, receta => receta.plato)
  recetas: Receta[];
}
