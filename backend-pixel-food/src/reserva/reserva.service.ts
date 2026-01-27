import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository as InjectTypeOrm } from '@nestjs/typeorm'; // Alias para claridad
import { Repository, DataSource } from 'typeorm';
import { Reserva } from './reserva.entity';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Usuario } from 'src/usuario/usuario.schema'; 
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rol } from 'src/rol/rol.entity'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class ReservaService {
  constructor(
    @InjectTypeOrm(Reserva)
    private reservaRepository: Repository<Reserva>,
    
    @InjectTypeOrm(Rol)
    private rolRepository: Repository<Rol>,
    
    private dataSource: DataSource,
    
    @InjectModel(Usuario.name) 
    private usuarioModel: Model<Usuario>,
  ) {}

  async create(dto: CreateReservaDto) {
    const fechaReserva = new Date(dto.fecha_reserva);

    // 1. Validar disponibilidad en Postgres
    const existeReserva = await this.reservaRepository.findOne({
      where: {
        id_mesa: dto.id_mesa,
        fecha_reserva: fechaReserva,
        hora: dto.hora,
        estado: 'CONFIRMADA',
      }
    });

    if (existeReserva) {
      throw new ConflictException(`LA MESA YA ESTÁ RESERVADA EN ESTE HORARIO.`);
    }

    // 2. Lógica de Usuario (MONGODB)
    let idUsuarioFinal = dto.id_usuario;
    const datosCliente = dto.datos_cliente;

    try {
      if (!idUsuarioFinal && datosCliente) {
        const { nombre, apellido, correo, telefono } = datosCliente as any;

        let usuarioExistente = await this.usuarioModel.findOne({ correo: correo.toLowerCase() });

        if (!usuarioExistente) {
          // --- BUSQUEDA DINÁMICA DEL ROL PARA OBTENER UUID ---
          const rolCliente = await this.rolRepository.findOne({
            where: { nombre: 'Cliente' as any } // Se usa 'Cliente' como está en tu DB
          });

          if (!rolCliente) {
            throw new NotFoundException('EL ROL "Cliente" NO FUE ENCONTRADO EN POSTGRES.');
          }

          const nuevoUsuarioData: any = {
            nombre: nombre.toUpperCase(),
            apellido: apellido ? apellido.toUpperCase() : ".",
            correo: correo.toLowerCase(),
            telefono: telefono || "00000000",
            rol_id: rolCliente.id_rol, // Guardamos el UUID real
            contrasena: 'PasswordTemporal123!',
          };

          const resultadoCreate: any = await this.usuarioModel.create(nuevoUsuarioData);
          usuarioExistente = resultadoCreate;
        }
        
        idUsuarioFinal = (usuarioExistente as any)._id.toString();
      }

      if (!idUsuarioFinal) {
        throw new BadRequestException('FALTAN DATOS DEL CLIENTE PARA VINCULAR LA RESERVA');
      }

      // 3. TRANSACCIÓN POSTGRES
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const { datos_cliente, ...datosParaReserva } = dto;

        const nuevaReserva = queryRunner.manager.create(Reserva, {
          ...datosParaReserva,
          id_usuario: idUsuarioFinal, 
          fecha_reserva: fechaReserva,
          estado: dto.estado || 'CONFIRMADA',
        });

        const resultado = await queryRunner.manager.save(nuevaReserva);
        await queryRunner.commitTransaction();
        return resultado;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`ESTA MESA YA TIENE UNA RESERVA REGISTRADA.`);
      }
      throw new BadRequestException(`ERROR EN OPERACIÓN: ${error.message}`);
    }
  }

  async findAll() {
    return await this.reservaRepository.find({
      relations: ['mesa', 'mesa.sucursal'],
      order: { fecha_reserva: 'DESC' },
    });
  }

  async findOne(id: string) {
    const reserva = await this.reservaRepository.findOne({
      where: { id_reserva: id },
      relations: ['mesa', 'mesa.sucursal'],
    });
    if (!reserva) throw new NotFoundException(`La reserva con ID ${id} no existe`);
    return reserva;
  }

  async update(id: string, dto: UpdateReservaDto) {
    const reserva = await this.findOne(id);
    if (dto.fecha_reserva) (dto as any).fecha_reserva = new Date(dto.fecha_reserva);
    Object.assign(reserva, dto);
    return await this.reservaRepository.save(reserva);
  }

  async remove(id: string) {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
    return { deleted: true, id_eliminado: id };
  }
}