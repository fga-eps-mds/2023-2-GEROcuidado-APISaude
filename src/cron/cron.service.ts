import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { CronJob } from 'cron';
import { lastValueFrom } from 'rxjs';
import { Rotina } from '../rotina/entities/rotina.entity';
import { RotinaService } from '../rotina/rotina.service';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly rotinaService: RotinaService,
    private readonly httpService: HttpService,
  ) {}

  onModuleInit(): void {
    this.initCronJobRotinas();
  }

  private initCronJobRotinas(): void {
    this.addCronJob('cronRotinas', '0 * * * * *', this.cronRotinas.bind(this));
  }

  addCronJob(
    name: string,
    cronExpression: string,
    callback: () => void | Promise<void>,
  ): void {
    const job = new CronJob(`${cronExpression}`, callback);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  async cronRotinas(): Promise<void> {
    Logger.log('CRONRotinas - Procurando rotinas...');
    const rotinas = await this.rotinaService.findAllToCron();

    Logger.log(
      `CRONRotinas - ${rotinas.length} rotinas encontradas! Enviando notificações...`,
    );

    const promises: Promise<AxiosResponse>[] = [];

    rotinas.forEach((rotina: Rotina) => {
      const promise = lastValueFrom(
        this.httpService.post('https://exp.host/--/api/v2/push/send', {
          to: rotina.token,
          sound: 'default',
          title: rotina.titulo,
          body: rotina.descricao,
          data: {
            id: rotina.id,
          },
        }),
      );

      promises.push(promise);
    });

    await Promise.all(promises);
    Logger.log('CRONRotinas - Notificações enviadas!');
  }
}
