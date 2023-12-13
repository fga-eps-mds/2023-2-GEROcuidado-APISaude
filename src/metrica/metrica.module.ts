import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metrica } from './entities/metrica.entity';
import { MetricaController } from './metrica.controller';
import { MetricaService } from './metrica.service';

@Module({
  imports: [TypeOrmModule.forFeature([Metrica])],
  controllers: [MetricaController],
  providers: [MetricaService, Repository],
  exports: [MetricaService],
})
export class MetricaModule {}
