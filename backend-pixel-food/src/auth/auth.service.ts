import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from 'src/usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import axios from 'axios'; 

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(token: string) {
    try {
      // 1. Validar el token directamente con Google
      const googleResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`,
      );
      
      const { email, given_name, family_name } = googleResponse.data;

      // 2. Buscar si el usuario ya existe por correo
      let usuario = await this.usuarioService.findByCorreo(email);

      // 3. Si no existe, lo creamos (sin enviar rol, tu service lo asigna)
      if (!usuario) {
        usuario = await this.usuarioService.create({
          nombre: given_name,
          apellido: family_name || '',
          correo: email,
          direccion: 'S/N', 
          telefono: '0000000000',
          contrasena: await bcrypt.hash(Math.random().toString(36), 10),
        });
      }

      // 4. Retornar el mismo login que ya tienes funcionando
      return this.login(usuario);

    } catch (error) {
      throw new UnauthorizedException('Fallo en la autenticación con Google');
    }
  }

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

  // 🔐 LOGIN FINAL (MANTENIDO EXACTAMENTE IGUAL)
  async login(usuario: any) {
    const info = await this.usuarioService.findByIdConPermisos(
      usuario._id.toString(),
    );

    const payload = {
      sub: usuario._id.toString(),
      correo: info.correo,
      rol: info.rol,
      permisos: info.permisos,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: usuario._id.toString(),
        correo: info.correo,
        rol: info.rol,
        permisos: info.permisos,
        nombre: info.nombre,
        apellido: info.apellido
      },
    };
  }
}