import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rol } from 'src/rol/rol.entity';

@Entity('usuario')
export class Usuario {

  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  telefono: string;

  @Column()
  direccion: string;

  @Column()
  contrasena: string;

  @Column('uuid')
  rol_id: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}
