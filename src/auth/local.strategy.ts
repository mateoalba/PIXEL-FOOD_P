import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'correo',
      passwordField: 'contrasena',
    });
  }

  async validate(correo: string, contrasena: string) {
    const usuario = await this.authService.validateUser(correo, contrasena);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return usuario;
  }
}
