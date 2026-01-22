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
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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

    if (!user?.permisos) {
      throw new ForbiddenException('Permisos no encontrados');
    }

    const tienePermiso = permisosRequeridos.some(p =>
      user.permisos.includes(p),
    );

    if (!tienePermiso) {
      throw new ForbiddenException('No tienes permiso');
    }

    return true;
  }
}

