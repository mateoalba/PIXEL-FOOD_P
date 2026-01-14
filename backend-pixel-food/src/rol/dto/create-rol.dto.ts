import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RolNombre } from '../rol.enum';

export class CreateRolDto {
  @IsEnum(RolNombre, {
    message: 'Rol inválido. Solo Administrador, Empleado o Cliente',
  })
  nombre: RolNombre;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
