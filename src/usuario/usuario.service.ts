import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateUsuarioDto) {
    const nuevo = this.usuarioRepo.create(dto);
    return await this.usuarioRepo.save(nuevo);
  }

  async findAll() {
    return await this.usuarioRepo.find();
  }

  async findOne(id: string) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no existe`);
    }

    return usuario;
  }

  async update(id: string, dto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);

    // PUT REEMPLAZA TODO
    usuario.nombre = dto.nombre;
    usuario.apellido = dto.apellido;
    usuario.correo = dto.correo;
    usuario.contrasena = dto.contrasena;
    usuario.telefono = dto.telefono;
    usuario.direccion = dto.direccion;
    usuario.rol_id = dto.rol_id;

    return await this.usuarioRepo.save(usuario);
  }

  async remove(id: string) {
    const usuario = await this.findOne(id);
    await this.usuarioRepo.remove(usuario);
    return usuario; 
  }
}
