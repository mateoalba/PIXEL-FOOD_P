import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './receta.entity';
import { Plato } from 'src/plato/plato.entity';
import { Ingrediente } from 'src/ingrediente/ingrediente.entity';
import { RecetaService } from './receta.service';
import { RecetaController } from './receta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Receta, Plato, Ingrediente])],
  controllers: [RecetaController],
  providers: [RecetaService],
})
export class RecetaModule {}
