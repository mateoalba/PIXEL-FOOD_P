import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingrediente } from './ingrediente.entity';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';

@Injectable()
export class IngredienteService {
  constructor(
    @InjectRepository(Ingrediente)
    private readonly ingredienteRepo: Repository<Ingrediente>,
  ) {}

  findAll() {
    return this.ingredienteRepo.find();
  }

  async findOne(id: string) {
    const ingrediente = await this.ingredienteRepo.findOne({ where: { id_ingrediente: id } });
    if (!ingrediente) throw new NotFoundException('Ingrediente no encontrado');
    return ingrediente;
  }

  create(dto: CreateIngredienteDto) {
    const nuevo = this.ingredienteRepo.create(dto);
    return this.ingredienteRepo.save(nuevo);
  }

  async update(id: string, dto: UpdateIngredienteDto) {
    const ingrediente = await this.findOne(id);
    Object.assign(ingrediente, dto);
    return this.ingredienteRepo.save(ingrediente);
  }

  async delete(id: string) {
    const ingrediente = await this.findOne(id);
    return this.ingredienteRepo.remove(ingrediente);
  }
}
