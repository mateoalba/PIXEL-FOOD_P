import { IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';

export class UpdateRolPermisoDto {
  @IsUUID()
  rol_id: string;

  @IsArray()
  @ArrayNotEmpty()
  permisos_ids: string[];
}
