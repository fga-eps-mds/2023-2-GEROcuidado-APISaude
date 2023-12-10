import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricaService } from './metrica.service';
import { Metrica } from './entities/metrica.entity';
import { CreateMetricaDto } from './dto/create-metrica-dto';
import { UpdateMetricaDto } from './dto/update-metrica-dto';
import { ECategoriaMetrica } from './classes/tipo-metrica.enum';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination, PaginationParams } from '../shared/decorators/paginate.decorator';
import { IMetricaFilter } from './interfaces/metrica-filter.interface';
import { Filtering } from '../shared/decorators/filtrate.decorator';


describe('MetricaService', () => {
  let service: MetricaService;
  let repository: Repository<Metrica>;

  const metricatest: CreateMetricaDto = {
    idIdoso: 2,
    categoria: ECategoriaMetrica.TEMPERATURA,
  };

  const mockRepository = {
    save: jest.fn(),
    findOneOrFail: jest.fn(),
    remove: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
    })),
    };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
              provide: getRepositoryToken(Metrica),
              useValue: mockRepository,
        },
        MetricaService,
      ],
    }).compile();

    service = module.get<MetricaService>(MetricaService);
    repository = module.get<Repository<Metrica>>(getRepositoryToken(Metrica));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('criacao metrica', async () => {
      const createMetricaDto: CreateMetricaDto = metricatest;
      const metrica = new Metrica(createMetricaDto);

      jest.spyOn(repository, 'save').mockResolvedValue(metrica);

      const result = await service.create(createMetricaDto);

      expect(result).toEqual(metrica);
      expect(repository.save).toHaveBeenCalledWith(metrica);
    });
    
  });
  
describe('findOne', () => {
    it('should find a metrica by id', async () => {
      const id = 1;
      const metrica = new Metrica(metricatest);

      jest.spyOn(repository, 'findOneOrFail').mockResolvedValue(metrica);

      const result = await service.findOne(id);

      expect(result).toEqual(metrica);
      expect(repository.findOneOrFail).toHaveBeenCalledWith({ where: { id } });
    });

  });

  describe('update', () => {
    it('should update a metrica by id', async () => {
      const id = 1;
      const updateMetricaDto: UpdateMetricaDto = {
        idIdoso: 3,
        categoria: ECategoriaMetrica.PRESSAO_SANGUINEA,
      };
      const metrica = new Metrica(metricatest);

      jest.spyOn(service, 'findOne').mockResolvedValue(metrica);
      jest.spyOn(repository, 'save').mockResolvedValue(metrica);

      const result = await service.update(id, updateMetricaDto);

      expect(result).toEqual(metrica);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updateMetricaDto));
    });

  });

  it('should remove Metrica', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

    const removed = await service.remove(1);
    expect(removed.id).toEqual(1);
});

describe('findAll', () => {
  const Metrica = {
      id: 1,
      idMetrica: 1,
  };

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

  const filter: IMetricaFilter = {
    idIdoso: 1,
  };

  const filtering = new Filtering<Metrica>(JSON.stringify(filter));

  it('should findAll Metrica', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
          where: () => ({
              limit: () => ({
                  offset: () => ({
                      orderBy: () => ({
                          getManyAndCount: jest.fn().mockResolvedValueOnce([[Metrica], 1]),
                      }),
                  }),
              }),
          }),
      } as any);

      const { data, count } = await service.findAll(
          filtering as any,
          ordering,
          pagination,
      );
      expect(count).toEqual(1);
      expect((data as Metrica[])[0]).toEqual(Metrica);

      const res = await service.findAll({}, ordering, pagination);
      expect(res.count).toEqual(1);
      expect((res.data as Metrica[])[0]).toEqual(Metrica);
  });

});


});