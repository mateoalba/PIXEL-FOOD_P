import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RolNombre } from './rol.enum';
import { RolPermiso } from 'src/rol-permiso/rol-permiso.entity';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id_rol: string;

  @Column({
    type: 'enum',
    enum: RolNombre,
    unique: true,
  })
  nombre: RolNombre;

  @Column({ nullable: true })
  descripcion: string;


  @OneToMany(() => RolPermiso, rp => rp.rol)
  rolPermisos: RolPermiso[];


}
