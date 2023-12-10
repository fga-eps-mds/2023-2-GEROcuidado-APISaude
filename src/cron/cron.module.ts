import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rotina } from '../rotina/entities/rotina.entity';
import { RotinaService } from '../rotina/rotina.service';
import { CronService } from './cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rotina]), HttpModule],
  providers: [CronService, RotinaService, Repository],
})
export class CronModule {}
