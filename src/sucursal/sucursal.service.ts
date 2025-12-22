import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private readonly sucursalRepo: Repository<Sucursal>,
  ) {}

  create(dto: CreateSucursalDto) {
    const nueva = this.sucursalRepo.create(dto);
    return this.sucursalRepo.save(nueva);
  }

  findAll() {
    return this.sucursalRepo.find();
  }

  async findOne(id: string) {
    const sucursal = await this.sucursalRepo.findOne({
      where: { id_sucursal: id },
    });

    if (!sucursal) throw new NotFoundException(`No existe sucursal con ID: ${id}`);

    return sucursal;
  }

  async update(id: string, dto: UpdateSucursalDto) {
    const sucursal = await this.findOne(id);


    sucursal.nombre = dto.nombre;
    sucursal.direccion = dto.direccion;
    sucursal.telefono = dto.telefono;
    sucursal.ciudad = dto.ciudad;
    sucursal.departamento = dto.departamento;

    return this.sucursalRepo.save(sucursal);
  }

  async remove(id: string) {
    const sucursal = await this.findOne(id);
    await this.sucursalRepo.remove(sucursal);
    return sucursal;
  }
}
