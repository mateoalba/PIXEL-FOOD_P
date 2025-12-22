import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Sucursal } from 'src/sucursal/sucursal.entity';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,

    @InjectRepository(Sucursal)
    private readonly sucursalRepository: Repository<Sucursal>,
  ) {}

  async crearMesa(dto: CreateMesaDto): Promise<Mesa> {
    const sucursal = await this.sucursalRepository.findOne({
      where: { id_sucursal: dto.id_sucursal },
    });

    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }

    const mesa = this.mesaRepository.create({
      numero: dto.numero,
      capacidad: dto.capacidad,
      estado: dto.estado,
      sucursal: sucursal,
    });

    return await this.mesaRepository.save(mesa);
  }

  async obtenerMesas(): Promise<Mesa[]> {
    return await this.mesaRepository.find({ relations: ['sucursal'] });
  }

  async obtenerMesaPorId(id: string): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({
      where: { id_mesa: id },
      relations: ['sucursal'],
    });

    if (!mesa) {
      throw new NotFoundException('Mesa no encontrada');
    }

    return mesa;
  }

  async actualizarMesa(id: string, dto: UpdateMesaDto): Promise<Mesa> {
    const mesa = await this.obtenerMesaPorId(id);

    if (dto.id_sucursal) {
      const sucursal = await this.sucursalRepository.findOne({
        where: { id_sucursal: dto.id_sucursal },
      });

      if (!sucursal) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      mesa.sucursal = sucursal;
    }

    Object.assign(mesa, dto);

    return await this.mesaRepository.save(mesa);
  }

  async eliminarMesa(id: string): Promise<Mesa> {
    const mesa = await this.obtenerMesaPorId(id);
    await this.mesaRepository.remove(mesa);
    return mesa;
  }
}
