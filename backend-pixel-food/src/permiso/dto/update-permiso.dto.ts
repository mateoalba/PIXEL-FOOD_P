import { IsOptional, IsString } from 'class-validator';

export class UpdatePermisoDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
