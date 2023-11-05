import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idoso } from './entities/idoso.entity';
import { IdosoController } from './idoso.controller';
import { IdosoService } from './idoso.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idoso]),
    ClientsModule.registerAsync([
      {
        name: 'USUARIO_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [IdosoController],
  providers: [IdosoService, Repository],
  exports: [IdosoService],
})
export class PublicacaoModule {}