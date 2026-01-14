import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from 'src/usuario/usuario.schema';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from 'src/rol/rol.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(correo: string, contrasena: string) {
    const usuario = await this.usuarioService.findByCorreo(correo);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return usuario;
  }

  // 🔐 LOGIN FINAL
  async login(usuario: any) {
    const info = await this.usuarioService.findByIdConPermisos(
      usuario._id.toString(),
    );

    const payload = {
      sub: usuario._id.toString(),
      correo: info.correo,
      rol: info.rol, // 👈 NOMBRE DEL ROL
      permisos: info.permisos,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: info, // 👈 frontend recibe rol + permisos
    };
  }
}
