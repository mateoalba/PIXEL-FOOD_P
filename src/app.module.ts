import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriaModule } from './categoria/categoria.module';
import { ConfigModule } from '@nestjs/config';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { AuthModule } from './auth/auth.module';
import { MesaModule } from './mesa/mesa.module';
import { IngredienteModule } from './ingrediente/ingrediente.module';
import { PlatoModule } from './plato/plato.module';
import { RecetaModule } from './receta/receta.module';
import { PedidoModule } from './pedido/pedido.module';
import { ReservaModule } from './reserva/reserva.module';
import { DetallePedidoModule } from './detalle_pedido/detalle_pedido.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MetodoPagoModule } from './metodo_pago/metodo_pago.module';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    SucursalModule,
    RolModule,
    ConfigModule.forRoot({
      isGlobal: true,   
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    CategoriaModule,
    UsuarioModule,
    SucursalModule,
    AuthModule,
    MesaModule,
    IngredienteModule,
    PlatoModule,
    RecetaModule,
    PedidoModule,
    ReservaModule,
    DetallePedidoModule,
    MetodoPagoModule,
    FacturaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
