import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './usuario.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RolNombre } from '../rol/rol.enum';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,

    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  // =====================
  // CRUD NORMAL
  // =====================

async create(dto: CreateUsuarioDto): Promise<Usuario> {
  const rolCliente = await this.rolRepo.findOne({
    where: { nombre: RolNombre.CLIENTE },
  });

  if (!rolCliente) {
    throw new NotFoundException('Rol CLIENTE no existe');
  }

  // 🔐 HASH DE CONTRASEÑA (AQUÍ VA)
  const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

  const nuevo = new this.usuarioModel({
    ...dto,
    contrasena: hashedPassword, // 👈 reemplaza la original
    rol_id: rolCliente.id_rol,
  });

  return nuevo.save();
}


async findAll() {
  const usuarios = await this.usuarioModel.find().exec();

  const resultado = await Promise.all(
    usuarios.map(async (usuario) => {
      const rol = await this.rolRepo.findOne({
        where: { id_rol: usuario.rol_id },
      });

      return {
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: rol ? rol.nombre : null, // 👈 AQUÍ
      };
    }),
  );

  return resultado;
}

async findOne(id: string) {
  const usuario = await this.usuarioModel.findById(id).exec();
  if (!usuario) throw new NotFoundException('Usuario no encontrado');

  const rol = await this.rolRepo.findOne({
    where: { id_rol: usuario.rol_id },
  });

  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    rol: rol ? rol.nombre : null, // 👈 nombre del rol
  };
}


async findByCorreo(correo: string): Promise<UsuarioDocument | null> {
  return this.usuarioModel.findOne({ correo }).exec();
}

async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
  if (dto.contrasena) {
    dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
  }

  const usuario = await this.usuarioModel.findByIdAndUpdate(
    id,
    dto,
    { new: true },
  );

  if (!usuario) throw new NotFoundException('Usuario no encontrado');
  return usuario;
}


  async remove(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByIdAndDelete(id);
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }

  // =====================
  // MÉTODO CLAVE PARA AUTH + PERMISOS
  // =====================

async findByIdConPermisos(id: string) {
  const usuario = await this.usuarioModel.findById(id).exec();

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const rol = await this.rolRepo.findOne({
    where: { id_rol: usuario.rol_id },
    relations: {
      rolPermisos: {
        permiso: true,
      },
    },
  });

  if (!rol) {
    throw new NotFoundException('Rol no encontrado');
  }

  const permisos = rol.rolPermisos.map(
    rp => rp.permiso.codigo,
  );

  return {
    correo: usuario.correo,
    rol: rol.nombre,
    permisos,
  };
}



}
