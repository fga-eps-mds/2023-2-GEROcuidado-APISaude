import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rotina } from './entities/rotina.entity';
import { RotinaController } from './rotina.controller';
import { RotinaService } from './rotina.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rotina])],
  controllers: [RotinaController],
  providers: [RotinaService, Repository],
  exports: [RotinaService],
})
export class RotinaModule {}
