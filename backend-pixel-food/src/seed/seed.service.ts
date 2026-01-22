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
      'gestionar_usuarios',


        // CATEGORIAS
      'ver_categorias',
      'crear_categorias',
      'editar_categorias',
      'eliminar_categorias',


        // SUCURSALES
      'ver_sucursales',
      'crear_sucursales',
      'editar_sucursales',
      'eliminar_sucursales',

        // MESAS
      'ver_mesas',
      'crear_mesas',
      'editar_mesas',
      'eliminar_mesas',

       //INGREDIENTES
      'ver_ingredientes',
      'crear_ingredientes',
      'editar_ingredientes',
      'editar_stock_ingredientes',
      'eliminar_ingredientes',

      //PLATOS
      'ver_platos',
      'crear_platos',
      'editar_platos',
      'eliminar_platos',

      //RECETAS
      'ver_recetas',
      'crear_recetas',
      'editar_recetas',
      'eliminar_recetas',

      //PEDIDOS
      'ver_pedidos',
      'crear_pedidos',
      'editar_pedidos',
      'cancelar_pedidos',


      //FACTURAS
      'ver_facturas',
      'crear_facturas',
      'editar_facturas',
      'eliminar_facturas',

      //DETALLES_PEDIDOS
      'ver_detalles_pedidos',
      'crear_detalles_pedidos',
      'editar_detalles_pedidos',
      'eliminar_detalles_pedidos',

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

      //ROLOS_CATEGORIAS_EMPLEADOS
      'ver_categorias',
      // ROLES_SUCURSALES_EMPLEADOS
      'ver_sucursales',
      //ROLES_MESAS
      'ver_mesas',
      'editar_mesas',
      //ROLES_INGREDIENTES_EMPLEADOS
      'ver_ingredientes',
      'editar_stock_ingredientes',
      //ROLES_PLATOS_EMPLEADOS
      'ver_platos',
      'editar_platos',
      //ROLES_RECETAS_EMPLEADOS
      'ver_recetas',
      //ROLES_PEDIDOS_EMPLEADOS
      'ver_pedidos',
      'crear_pedidos',
      'editar_pedidos',
      //ROLES_FACTURAS_EMPLEADOS
      'ver_facturas',
      'crear_facturas',
      //ROLES_DETALLES_PEDIDOS_EMPLEADOS
      'ver_detalles_pedidos',
      'crear_detalles_pedidos',
      'editar_detalles_pedidos',  //solo si esta pendiente

    ]);

    // CLIENTE
    await this.asignarPorCodigo(cliente, [

    // ROLES_CATEGORIAS_CLIENTE
      'ver_categorias',
    // ROLES_SUCURSALES_CLIENTE
      'ver_sucursales',
    //ROLES_PLATOS_CLIENTE
      'ver_platos',
    //ROLES_MESAS_CLIENTE
      'ver_mesas',
    //ROLES_PEDIDOS_CLIENTE
      'ver_pedidos',
      'crear_pedidos',
      'cancelar_pedidos',
    //ROLES_FACTURAS_CLIENTE
      'ver_facturas',
    //ROLES_DETALLES_PEDIDOS_CLIENTE
      'ver_detalles_pedidos', //solo el suyo 

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
