import { Controller, Post, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  // --- NUEVA RUTA PARA GOOGLE ---
  @Post('google')
  async googleAuth(@Body('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('No se proporcionó el token de Google');
    }
    // Llamamos a un nuevo método que crearemos en el AuthService
    return this.authService.loginWithGoogle(token);
  }
}