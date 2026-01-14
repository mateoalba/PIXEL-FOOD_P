import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';
import { RolPermiso } from '../rol-permiso/rol-permiso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rol, Permiso, RolPermiso]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
