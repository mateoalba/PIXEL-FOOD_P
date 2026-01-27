import { 
  IsNotEmpty, 
  IsString, 
  IsNumber, 
  IsISO8601, 
  IsOptional, 
  IsObject,
  ValidateNested,
  IsEmail
} from 'class-validator';
import { Type } from 'class-transformer';

// Clase para validar los datos del cliente que se guardarán en MONGO
class DatosClienteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  apellido: string; 

  @IsEmail({}, { message: 'El correo debe ser un email válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  correo: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}

export class CreateReservaDto {
  // id_usuario viene de MONGO (es un string/ObjectId)
  @IsOptional()
  @IsString() 
  id_usuario?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DatosClienteDto)
  datos_cliente?: DatosClienteDto;

  // id_mesa e id_sucursal vienen de POSTGRES (UUID)
  // Usamos @IsString para que acepte el UUID sin errores de validación previos
  @IsString()
  @IsNotEmpty()
  id_mesa: string;

  @IsString()
  @IsNotEmpty()
  id_sucursal: string;

  @IsISO8601({}, { message: 'La fecha debe ser YYYY-MM-DD' })
  @IsNotEmpty()
  fecha_reserva: string;

  @IsString()
  @IsNotEmpty()
  hora: string;

  @IsNumber()
  @IsNotEmpty()
  numero_personas: number;

  @IsString()
  @IsOptional()
  estado?: string;
}