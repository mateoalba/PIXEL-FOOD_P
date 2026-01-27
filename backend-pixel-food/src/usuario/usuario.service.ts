import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

async create(dto: CreateUsuarioDto): Promise<any> {
  // 1️⃣ Obtener rol CLIENTE
  const rolCliente = await this.rolRepo.findOne({
    where: { nombre: RolNombre.CLIENTE },
  });

  if (!rolCliente) {
    throw new NotFoundException('Rol CLIENTE no existe');
  }

  // 2️⃣ Hash de la contraseña
  const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

  // 3️⃣ Crear usuario
  const nuevo = new this.usuarioModel({
    ...dto,
    contrasena: hashedPassword,
    rol_id: rolCliente.id_rol,
  });

  try {
    const usuarioCreado = await nuevo.save();

    // 4️⃣ Retornar datos limpios al frontend
    return {
      _id: usuarioCreado._id,
      nombre: usuarioCreado.nombre,
      apellido: usuarioCreado.apellido,
      correo: usuarioCreado.correo,
      telefono: usuarioCreado.telefono,
      direccion: usuarioCreado.direccion,
      rol: rolCliente.nombre, // 🔹 Nombre del rol
    };
  } catch (error: any) {
    // 🔹 Correo duplicado
    if (error.code === 11000 && error.keyPattern?.correo) {
      throw new BadRequestException('El correo ya está registrado');
    }

    // 🔹 Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(', ');
      throw new BadRequestException(`Error de validación: ${mensajes}`);
    }

    // 🔹 Error de tipo inválido (CastError)
    if (error.name === 'CastError') {
      throw new BadRequestException(`Valor inválido para el campo ${error.path}`);
    }

    // 🔹 Otros errores inesperados
    throw error;
  }
}





/*Editar Perfil Usuario*/

async updateMe(userId: string, dto: UpdateUsuarioDto) {
  const usuario = await this.usuarioModel.findById(userId);

  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  // ❌ BLOQUEAR CORREO (rol ya no existe en el DTO)
  delete dto.correo;

  // 🔐 HASH SI CAMBIA CONTRASEÑA
  if (dto.contrasena) {
    dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
  }

  Object.assign(usuario, dto);
  await usuario.save();

  return {
    correo: usuario.correo,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
  };
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



async update(id: string, dto: UpdateUsuarioDto): Promise<any> {
  if (dto.contrasena) {
    dto.contrasena = await bcrypt.hash(dto.contrasena, 10);
  }

  const usuario = await this.usuarioModel.findByIdAndUpdate(
    id,
    dto,
    { new: true },
  );

  if (!usuario) throw new NotFoundException('Usuario no encontrado');



  // Si se actualizó el rol, traer el nombre del rol actualizado
  let rolNombre: string | null = null;
  if (usuario.rol_id) {
    const rol = await this.rolRepo.findOne({ where: { id_rol: usuario.rol_id } });
    rolNombre = rol ? rol.nombre : null;
  }

  return {
    _id: usuario._id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correo: usuario.correo,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    rol: rolNombre,
  };
}


async remove(id: string): Promise<Usuario> 
{ const usuario = await this.usuarioModel.findByIdAndDelete(id); 
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

  // ✅ CORRECCIÓN: Devolvemos todos los campos necesarios
  return {
    _id: usuario._id.toString(), // Incluimos el ID de Mongo
    nombre: usuario.nombre,      // Incluimos el Nombre
    apellido: usuario.apellido,  // Incluimos el Apellido
    correo: usuario.correo,
    rol: rol.nombre,
    permisos,
  };


}
}
