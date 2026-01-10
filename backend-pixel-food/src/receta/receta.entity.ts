import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Plato } from 'src/plato/plato.entity';
import { Ingrediente } from 'src/ingrediente/ingrediente.entity';

@Entity('receta')
export class Receta {
  @PrimaryGeneratedColumn('uuid')
  id_receta: string;

  @ManyToOne(() => Plato, plato => plato.recetas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_plato' })
  plato: Plato;

  @ManyToOne(() => Ingrediente, ingrediente => ingrediente.recetas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_ingrediente' })
  ingrediente: Ingrediente;

  @Column('decimal')
  cantidad: number;
}
