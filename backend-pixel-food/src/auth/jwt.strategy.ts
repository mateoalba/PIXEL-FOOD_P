import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretkey123', // luego pásalo a .env
    });
  }

async validate(payload: any) {
  const usuario = await this.usuarioService.findByIdConPermisos(
    payload.sub,
  );

  return {
    id: payload.sub,
    correo: usuario.correo,
    rol: usuario.rol,
    permisos: usuario.permisos,
  };
}


}
