import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../decorators/permisos.decorator';
import { UsuarioService } from '../../usuario/usuario.service';



@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usuarioService: UsuarioService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permisosRequeridos =
      this.reflector.getAllAndOverride<string[]>(
        PERMISOS_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!permisosRequeridos || permisosRequeridos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.id) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const usuarioCompleto =
      await this.usuarioService.findByIdConPermisos(user.id_usuario);

const permisosUsuario = usuarioCompleto.permisos;

const tienePermiso = permisosRequeridos.some(p =>
  permisosUsuario.includes(p),
);


    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permiso');
    }

    return true;
  }
}
