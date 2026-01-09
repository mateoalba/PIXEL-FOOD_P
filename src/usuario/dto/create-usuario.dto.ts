import {IsString,IsEmail,IsNotEmpty,IsOptional,MinLength,Matches,} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @MinLength(8, {
    message: 'La contraseña debe tener mínimo 8 caracteres',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    {
      message:
        'La contraseña debe tener al menos una mayúscula, una minúscula y un número',
    },
  )
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  rol_id: string;
}
