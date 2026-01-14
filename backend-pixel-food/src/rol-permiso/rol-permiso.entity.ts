import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';

@Entity('rol_permiso')
export class RolPermiso {
  @PrimaryGeneratedColumn('uuid')
  id_rol_permiso: string;

  @ManyToOne(() => Rol, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;

  @ManyToOne(() => Permiso, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_permiso' })
  permiso: Permiso;
}


