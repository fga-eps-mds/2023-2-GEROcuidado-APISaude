import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutenticacaoGuard } from './autenticacao.guard';
import { DbModule } from './config/db/db.module';
import { DbService } from './config/db/db.service';
import { CronModule } from './cron/cron.module';
import { IdosoModule } from './idoso/idoso.module';
import { MetricaModule } from './metrica/metrica.module';
import { RotinaModule } from './rotina/rotina.module';
import { ValorMetricaModule } from './valorMetrica/valorMetrica.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DbModule],
      useClass: DbService,
    }),
    ClientsModule.registerAsync([
      {
        name: 'USUARIO_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('USUARIO_HOST'),
            port: configService.get('USUARIO_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DbModule,
    IdosoModule,
    RotinaModule,
    MetricaModule,
    ValorMetricaModule,
    CronModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AutenticacaoGuard,
    },
  ],
})
export class AppModule {}
