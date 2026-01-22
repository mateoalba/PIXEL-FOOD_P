import { Controller, Post, Get, Put, Delete, Param, Body,Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

import { PermisosGuard } from '../auth/guards/permiso.guard';
import { Permisos } from '../auth/decorators/permisos.decorator';
import { Request } from '@nestjs/common';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuarioService.create(dto);
  }

    // PERFIL PROPIO
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(@Request() req, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.updateMe(req.user.id, dto);
  }


  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Permisos('gestionar_usuarios')
  @Get()
  findAll() {
    console.log('🔥 ENTRE A FINDALL');
    return this.usuarioService.findAll();
  }


  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Permisos('gestionar_usuarios')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }


  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Permisos('gestionar_usuarios')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, dto);
  }


  @UseGuards(JwtAuthGuard, PermisosGuard)
  @Permisos('gestionar_usuarios')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }


}

