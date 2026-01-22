import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Asegúrate de importar tu interfaz o clase de MetodoPago
import { MetodoPago } from './metodo_pago.schema'; 

@Injectable()
export class MetodoPagoSeedService implements OnModuleInit {
  constructor(
    @InjectModel('MetodoPago') private readonly metodoModel: Model<MetodoPago>,
  ) {}

  // ✅ La forma correcta es: async nombreDelMetodo()
async onModuleInit() {
  // 1. Limpieza absoluta
  await this.metodoModel.deleteMany({});
  console.log('🧹 MongoDB: Limpiando registros antiguos...');
  
  const opcionesDefinidas = [
    { id_metodo: 'METODO_EFECTIVO', tipo: 'Efectivo', descripcion: 'Pago en efectivo' },
    { id_metodo: 'METODO_TARJETA', tipo: 'Tarjeta', descripcion: 'Pago con tarjeta' },
    { id_metodo: 'METODO_TRANSFERENCIA', tipo: 'Transferencia', descripcion: 'Pago por transferencia' },
  ];

  // 2. Inserción masiva directa para evitar el bucle 'if(!existe)' durante el desarrollo
  await this.metodoModel.insertMany(opcionesDefinidas);
  console.log('✅ Seed: Métodos de pago sincronizados correctamente');
}
}