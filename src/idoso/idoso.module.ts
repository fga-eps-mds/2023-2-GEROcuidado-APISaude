import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idoso } from './entities/idoso.entity';
import { IdosoController } from './idoso.controller';
import { IdosoService } from './idoso.service';

@Module({
  imports: [TypeOrmModule.forFeature([Idoso])],
  controllers: [IdosoController],
  providers: [IdosoService, Repository],
  exports: [IdosoService],
})
export class IdosoModule {}
