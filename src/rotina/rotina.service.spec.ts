import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { Rotina } from './entities/rotina.entity';
import { RotinaService } from './rotina.service';

describe('RotinaService', () => {
  let service: RotinaService;
  let repository: Repository<Rotina>;

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
          provide: getRepositoryToken(Rotina),
          useValue: mockRepository,
        },
        RotinaService,
      ],
    }).compile();

    service = module.get<RotinaService>(RotinaService);
    repository = module.get<Repository<Rotina>>(getRepositoryToken(Rotina));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create Rotina', async () => {
    const rotina = { titulo: 'titulo' } as any;
    jest.spyOn(repository, 'save').mockReturnValue({ id: 1 } as any);
    const created = await service.create(rotina);
    expect(created.id).toEqual(1);
  });

  it('should find Rotina', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);

    const found = await service.findOne(1);
    expect(found.id).toEqual(1);
  });

  it('should remove Rotina', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

    const removed = await service.remove(1);
    expect(removed.id).toEqual(1);
  });

  it('should update Rotina', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, titulo: 'titulo' } as any);

    const found = await service.update(1, { titulo: 'titulo' });
    expect(found).toEqual({ id: 1, titulo: 'titulo' });
  });

  describe('findAll', () => {
    const rotina = {
      id: 1,
      titulo: 'titulo',
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

    it('should findAll Rotina', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          limit: () => ({
            offset: () => ({
              orderBy: () => ({
                getManyAndCount: jest.fn().mockResolvedValueOnce([[rotina], 1]),
              }),
            }),
          }),
        }),
      } as any);

      const { data, count } = await service.findAll(
        { dataHora: new Date().toISOString() },
        ordering,
        pagination,
      );
      expect(count).toEqual(1);
      expect((data as Rotina[])[0]).toEqual(rotina);

      const res = await service.findAll({}, ordering, pagination);
      expect(res.count).toEqual(1);
      expect((res.data as Rotina[])[0]).toEqual(rotina);
    });

    it('should findAllToCron Rotina', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          getMany: jest.fn().mockResolvedValueOnce([rotina]),
        }),
      } as any);

      const data = await service.findAllToCron();
      expect((data as Rotina[])[0]).toEqual(rotina);
    });
  });
});
