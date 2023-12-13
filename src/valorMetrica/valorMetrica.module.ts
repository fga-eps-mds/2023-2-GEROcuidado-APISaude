import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValorMetrica } from './entities/valorMetrica.entity';
import { ValorMetricaController } from './valorMetrica.controller';
import { ValorMetricaService } from './valorMetrica.service';

@Module({
  imports: [TypeOrmModule.forFeature([ValorMetrica])],
  controllers: [ValorMetricaController],
  providers: [ValorMetricaService, Repository],
  exports: [ValorMetricaService],
})
export class ValorMetricaModule {}
