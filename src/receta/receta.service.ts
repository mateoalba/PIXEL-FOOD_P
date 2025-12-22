import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receta } from './receta.entity';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';
import { Plato } from 'src/plato/plato.entity';
import { Ingrediente } from 'src/ingrediente/ingrediente.entity';

@Injectable()
export class RecetaService {
  constructor(
    @InjectRepository(Receta)
    private recetaRepo: Repository<Receta>,

    @InjectRepository(Plato)
    private platoRepo: Repository<Plato>,

    @InjectRepository(Ingrediente)
    private ingredienteRepo: Repository<Ingrediente>,
  ) {}

  async create(dto: CreateRecetaDto) {
    const plato = await this.platoRepo.findOne({ where: { id_plato: dto.id_plato } });
    if (!plato) throw new NotFoundException('Plato no encontrado');

    const ingrediente = await this.ingredienteRepo.findOne({ where: { id_ingrediente: dto.id_ingrediente } });
    if (!ingrediente) throw new NotFoundException('Ingrediente no encontrado');

    const receta = this.recetaRepo.create({
      cantidad: dto.cantidad,
      plato,
      ingrediente,
    });

    return await this.recetaRepo.save(receta);
  }

  async findAll() {
    return this.recetaRepo.find({
      relations: ['plato', 'ingrediente'],
    });
  }

  async findOne(id: string) {
    const receta = await this.recetaRepo.findOne({
      where: { id_receta: id },
      relations: ['plato', 'ingrediente'],
    });

    if (!receta) throw new NotFoundException('Receta no encontrada');

    return receta;
  }

  async update(id: string, dto: UpdateRecetaDto) {
    const receta = await this.findOne(id);

  if (dto.id_plato) {
    const plato = await this.platoRepo.findOne({ where: { id_plato: dto.id_plato } });
    if (!plato) throw new NotFoundException('Plato no encontrado');
    receta.plato = plato;
  }

  if (dto.id_ingrediente) {
    const ingrediente = await this.ingredienteRepo.findOne({ where: { id_ingrediente: dto.id_ingrediente } });
    if (!ingrediente) throw new NotFoundException('Ingrediente no encontrado');
    receta.ingrediente = ingrediente;
  }

    Object.assign(receta, dto);

    return await this.recetaRepo.save(receta);
  }

  async remove(id: string) {
    const receta = await this.findOne(id);
    return await this.recetaRepo.remove(receta);
  }
}
