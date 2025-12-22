import { IsString, IsUUID, IsEmail } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsString()
  telefono: string;

  @IsString()
  direccion: string;

  @IsString()
  contrasena: string;

  @IsUUID()
  rol_id: string;
}
