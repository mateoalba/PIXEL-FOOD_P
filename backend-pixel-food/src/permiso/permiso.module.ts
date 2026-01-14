import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permiso } from './permiso.entity';
import { PermisoService } from './permiso.service';
import { PermisoController } from './permiso.controller';
import { UsuarioModule } from '../usuario/usuario.module'; // 👈

@Module({
  imports: [
    TypeOrmModule.forFeature([Permiso]),
    UsuarioModule, // 👈 ESTO ARREGLA EL ERROR
  ],
  controllers: [PermisoController],
  providers: [PermisoService],
  exports: [TypeOrmModule, PermisoService],
})
export class PermisoModule {}
