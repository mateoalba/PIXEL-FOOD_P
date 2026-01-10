import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string) {
    const usuario = await this.usuarioService.findByCorreo(correo);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    if (usuario.contrasena !== contrasena) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return usuario;
  }

  async login(usuario: any) {
    const payload = {
      sub: usuario.id_usuario,
      correo: usuario.correo,
      rol: usuario.rol_id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
