import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingrediente } from './ingrediente.entity';
import { IngredienteService } from './ingrediente.service';
import { IngredienteController } from './ingrediente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ingrediente])],
  controllers: [IngredienteController],
  providers: [IngredienteService],
})
export class IngredienteModule {}
