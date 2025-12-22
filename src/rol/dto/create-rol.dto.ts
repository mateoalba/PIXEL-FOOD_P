import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
