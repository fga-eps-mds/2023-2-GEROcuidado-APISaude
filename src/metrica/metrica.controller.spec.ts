import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { ECategoriaMetrica } from './classes/tipo-metrica.enum';
import { Metrica } from './entities/metrica.entity';
import { IMetricaFilter } from './interfaces/metrica-filter.interface';
import { MetricaController } from './metrica.controller';
import { MetricaService } from './metrica.service';

describe('MetricaController', () => {
  let controller: MetricaController;
  let service: MetricaService;

  const metricaDto = {
    idIdoso: 1,
    categoria: ECategoriaMetrica.FREQUENCIA_CARDIACA,
    valoresMetricas: [],
  };

  const metrica = {
    ...metricaDto,
    id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [MetricaController],
      providers: [
        {
          provide: MetricaService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Metrica),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MetricaController>(MetricaController);
    service = module.get<MetricaService>(MetricaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create IMetrica', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValue(Promise.resolve(metrica as Metrica));

    const response = await controller.create(metricaDto);
    expect(response.data).toEqual(metrica);
    expect(response.message).toEqual('Salvo com sucesso!');
  });

  it('should find IMetrica', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(metrica as Metrica));

    const response = await controller.findOne({ id: 1 });
    expect(response).toEqual(metrica);
  });

  it('should remove IMetrica', async () => {
    jest
      .spyOn(service, 'remove')
      .mockReturnValue(Promise.resolve(metrica as Metrica));

    const response = await controller.remove({ id: 1 });
    expect(response.data).toEqual(metrica);
    expect(response.message).toEqual('Excluído com sucesso!');
  });

  it('should update IMetrica', async () => {
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(metrica as Metrica));

    const response = await controller.update({ id: 1 }, { idIdoso: 2 });
    expect(response.data).toEqual(metrica);
    expect(response.message).toEqual('Atualizado com sucesso!');
  });

  describe('findAll', () => {
    const filter: IMetricaFilter = {
      idIdoso: 1,
    };
    const filtering = new Filtering<Metrica>(JSON.stringify(filter));

    const order: OrderParams = {
      column: 'id',
      dir: 'ASC',
    };
    const ordering: Ordering = new Ordering(JSON.stringify(order));

    const paginate: PaginationParams = {
      limit: 10,
      offset: 0,
    };
    const pagination: Pagination = new Pagination(paginate);

    it('should findAll Metrica', async () => {
      const expected = { data: [metrica], count: 1, pageSize: 1 };

      jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(expected));

      const { data, count, pageSize } = await controller.findAll(
        filtering as any,
        pagination,
        ordering,
      );

      expect(count).toEqual(1);
      expect(pageSize).toEqual(1);
      expect(data).toEqual([metrica]);
    });
  });
});
