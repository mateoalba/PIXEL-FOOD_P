import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plato } from './plato.entity';
import { Categoria } from 'src/categoria/categoria.entity';
import { PlatoService } from './plato.service';
import { PlatoController } from './plato.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plato, Categoria])],
  controllers: [PlatoController],
  providers: [PlatoService],
})
export class PlatoModule {}
