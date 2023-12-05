import { HttpModule, HttpService } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { ECategoriaRotina } from '../rotina/classes/categoria-rotina.enum';
import { Rotina } from '../rotina/entities/rotina.entity';
import { RotinaService } from '../rotina/rotina.service';
import { AppModule } from './../app.module';
import { CronService } from './cron.service';

jest.mock('cron', () => {
  const mScheduleJob = { start: jest.fn(), stop: jest.fn() };
  const mCronJob = jest.fn(() => mScheduleJob);
  return { CronJob: mCronJob };
});

describe('CronService', () => {
  let service: CronService;
  let rotinaService: RotinaService;
  let schedulerRegistry: SchedulerRegistry;
  let httpService: HttpService;

  const rotina = {
    idIdoso: 1,
    titulo: 'titulo',
    categoria: ECategoriaRotina.ALIMENTACAO,
    descricao: 'desc',
    dataHora: new Date().toISOString() as any,
    dataHoraConcluidos: [],
    dias: [0, 1],
    token: '',
    notificacao: false,
    id: 1,
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
      providers: [
        {
          provide: RotinaService,
          useValue: {
            findAllToCron() {
              return of([rotina]);
            },
          },
        },
        {
          provide: getRepositoryToken(Rotina),
          useValue: mockRepository,
        },
        CronService,
      ],
    }).compile();

    service = module.get<CronService>(CronService);
    rotinaService = module.get<RotinaService>(RotinaService);
    httpService = module.get<HttpService>(HttpService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call rotina service', async () => {
    service.onModuleInit();

    const spy = jest
      .spyOn(rotinaService, 'findAllToCron')
      .mockReturnValue(Promise.resolve([rotina]));

    const spyHttp = jest
      .spyOn(httpService, 'post')
      .mockReturnValue(of(true as any));

    await service.cronRotinas();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spyHttp).toHaveBeenCalledTimes(1);
    schedulerRegistry.deleteCronJob('cronRotinas');
  });
});
