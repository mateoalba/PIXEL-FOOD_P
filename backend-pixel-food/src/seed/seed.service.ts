import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../rol/rol.entity';
import { Permiso } from '../permiso/permiso.entity';
import { RolPermiso } from '../rol-permiso/rol-permiso.entity';
import { RolNombre } from '../rol/rol.enum';


@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
    @InjectRepository(Permiso) private permisoRepo: Repository<Permiso>,
    @InjectRepository(RolPermiso) private rpRepo: Repository<RolPermiso>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedPermisos();
    await this.seedRolPermisos();
  }

  // 1️⃣ ROLES
  async seedRoles() {
    const roles: RolNombre[] = [
      RolNombre.ADMINISTRADOR,
      RolNombre.EMPLEADO,
      RolNombre.CLIENTE,
    ];

    for (const nombre of roles) {
      const existe = await this.rolRepo.findOne({
        where: { nombre },
      });

      if (!existe) {
        await this.rolRepo.save(
          this.rolRepo.create({ nombre }),
        );
      }
    }
  }

  // 2️⃣ PERMISOS
  async seedPermisos() {
    const permisos = [
      'ver_menu',
      'crear_pedido',
      'ver_pedidos',
      'actualizar_estado_pedido',
      'registrar_pago',
      'gestionar_roles',
    ];

    for (const codigo of permisos) {
      const existe = await this.permisoRepo.findOne({
        where: { codigo },
      });

      if (!existe) {
        await this.permisoRepo.save(
          this.permisoRepo.create({
            codigo,
            descripcion: codigo,
          }),
        );
      }
    }
  }

  // 3️⃣ ASIGNAR PERMISOS
  async seedRolPermisos() {
    const admin = await this.rolRepo.findOne({
      where: { nombre: RolNombre.ADMINISTRADOR },
    });

    const empleado = await this.rolRepo.findOne({
      where: { nombre: RolNombre.EMPLEADO },
    });

    const cliente = await this.rolRepo.findOne({
      where: { nombre: RolNombre.CLIENTE },
    });

    if (!admin || !empleado || !cliente) {
      throw new Error('Roles no encontrados');
    }

    const permisos = await this.permisoRepo.find();

    // ADMIN → TODOS
    for (const permiso of permisos) {
      await this.asignarSiNoExiste(admin, permiso);
    }

    // EMPLEADO
    await this.asignarPorCodigo(empleado, [
      'ver_menu',
      'crear_pedido',
      'ver_pedidos',
      'actualizar_estado_pedido',
      'registrar_pago',
    ]);

    // CLIENTE
    await this.asignarPorCodigo(cliente, [
      'ver_menu',
      'crear_pedido',
    ]);
  }

  // Helpers
  async asignarSiNoExiste(rol: Rol, permiso: Permiso) {
    const existe = await this.rpRepo.findOne({
      where: {
        rol: { id_rol: rol.id_rol } as any,
        permiso: { id_permiso: permiso.id_permiso } as any,
      },
    });

    if (!existe) {
      await this.rpRepo.save(
        this.rpRepo.create({ rol, permiso }),
      );
    }
  }

  async asignarPorCodigo(rol: Rol, codigos: string[]) {
    for (const codigo of codigos) {
      const permiso = await this.permisoRepo.findOne({
        where: { codigo },
      });

      if (permiso) {
        await this.asignarSiNoExiste(rol, permiso);
      }
    }
  }
}
