🍔 Pixel-Food API – NestJS
API backend desarrollada con NestJS para la gestión de un sistema de pedidos de comida (Pixel-Food).
El proyecto utiliza arquitectura modular, PostgreSQL para datos relacionales y MongoDB para datos no relacionales.

🧱 Tecnologías utilizadas
Node.js

NestJS

TypeORM (PostgreSQL)

Mongoose (MongoDB)

UUID

dotenv

MongoDB Compass (visualización de datos)

🗄️ Arquitectura de Base de Datos
Este proyecto utiliza dos motores de base de datos:

📌 PostgreSQL (TypeORM)
Se usa para entidades relacionales:

Categoría

Usuario

Rol

Sucursal

Mesa

Ingrediente

Plato

Receta

Pedido

Reserva

Detalle Pedido

📌 MongoDB (Mongoose)
Se usa para entidades no relacionales y más flexibles:

Método de Pago

(Preparado para Factura)

⚙️ Configuración de variables de entorno (.env)
El archivo .env centraliza todas las credenciales y configuraciones sensibles.

🔹 PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=pixel_food_db
Estas variables son usadas por TypeORM en typeorm.config.ts.

🔹 MongoDB
MONGO_URI=mongodb://localhost:27017/pixel_food_mongo_db
📌 Nota importante:
No es necesario definir MONGO_DB_NAME por separado, ya que el nombre de la base de datos va incluido en la URI.

🔌 Conexión a MongoDB en NestJS
La conexión se configura directamente en AppModule:

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
})
export class AppModule {}
💳 Módulo Método de Pago (MongoDB)
El módulo MetodoPago está completamente conectado a MongoDB usando Mongoose.

📁 Estructura
src/metodo_pago
├── dto
│   ├── create-metodo-pago.dto.ts
│   └── update-metodo-pago.dto.ts
├── metodo_pago.controller.ts
├── metodo_pago.service.ts
├── metodo_pago.module.ts
└── metodo_pago.schema.ts
🧾 Schema MetodoPago (MongoDB)
Se usa UUID como identificador público (id_metodo)

MongoDB sigue usando _id internamente, pero no se expone

Se ocultan _id y __v en la respuesta JSON

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ collection: 'metodos_pago', timestamps: true })
export class MetodoPago {
  @Prop({ default: uuid })
  id_metodo: string;

  @Prop({ required: true })
  tipo: string; // Efectivo | Tarjeta | Transferencia

  @Prop()
  descripcion: string;
}

export const MetodoPagoSchema = SchemaFactory.createForClass(MetodoPago);

MetodoPagoSchema.set('toJSON', {
  versionKey: false,
  transform: (_, ret: any) => {
    ret.id = ret._id;     // si se desea exponer como "id"
    delete ret._id;      // elimina ObjectId interno
    delete ret.__v;      // elimina versión
    return ret;
  },
});
📌 Resultado en Postman:

{
  "tipo": "Tarjeta",
  "descripcion": "Pago con tarjeta VISA",
  "id_metodo": "87de724c-0f3d-4dda-bdaf-fae144bfe9fd",
  "createdAt": "2025-12-15T00:40:11.940Z",
  "updatedAt": "2025-12-15T00:40:11.940Z",
  "id": "693f58eb443b7398a5dbc898"
}
📥 DTOs
Crear Método de Pago
export class CreateMetodoPagoDto {
  tipo: string;
  descripcion?: string;
}
Actualizar Método de Pago
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMetodoPagoDto extends PartialType(CreateMetodoPagoDto) {}
🧠 Lógica de negocio (Service)
CRUD completo

Uso de @InjectModel

Métodos:

create

findAll

findOne

update

remove

🌐 Controlador (Controller)
Rutas disponibles:

POST    /metodo_pago
GET     /metodo_pago
GET     /metodo_pago/:id
PUT     /metodo_pago/:id
DELETE  /metodo_pago/:id




nest generate module categoria
nest generate controller categoria
nest generate service categoria

nest generate module rol
nest generate controller rol
nest generate service rol

nest generate module usuario
nest generate controller usuario
nest generate service usuario

nest generate module sucursal
nest generate controller sucursal
nest generate service sucursal

nest generate module mesa
nest generate controller mesa
nest generate service mesa

nest generate module ingrediente
nest generate controller ingrediente
nest generate service ingrediente

nest generate module plato
nest generate controller plato
nest generate service plato

nest generate module receta
nest generate controller receta
nest generate service receta

nest generate module pedido
nest generate controller pedido
nest generate service pedido

nest generate module reserva
nest generate controller reserva
nest generate service reserva

nest generate module detalle_pedido
nest generate controller detalle_pedido
nest generate service detalle_pedido

nest generate module metodo_pago
nest generate controller metodo_pago
nest generate service metodo_pago