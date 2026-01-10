import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
  ) {}

async create(dto: CreateUsuarioDto): Promise<Usuario> {
  try {
    const nuevo = new this.usuarioModel(dto);
    return await nuevo.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new ConflictException('El correo ya está registrado');
    }
    throw error;
  }
}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().exec();
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).exec();
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    return usuario;
  }


  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ correo }).exec();
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<Usuario> {
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

}
