import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Mesa } from 'src/mesa/mesa.entity';

@Entity('sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn('uuid')
  id_sucursal: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @OneToMany(() => Mesa, (mesa) => mesa.sucursal)
  mesas: Mesa[];
}
