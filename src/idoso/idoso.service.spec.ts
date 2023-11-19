import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { Idoso } from './entities/idoso.entity';
import { IdosoService } from './idoso.service';

describe('IdosoService', () => {
  let service: IdosoService;
  let repository: Repository<Idoso>;

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
          provide: getRepositoryToken(Idoso),
          useValue: mockRepository,
        },
        IdosoService,
      ],
    }).compile();

    service = module.get<IdosoService>(IdosoService);
    repository = module.get<Repository<Idoso>>(getRepositoryToken(Idoso));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create Idoso', async () => {
    const idoso = { nome: 'Henrique' } as any;
    jest.spyOn(repository, 'save').mockReturnValue({ id: 1 } as any);
    const created = await service.create(idoso);
    expect(created.id).toEqual(1);
  });

  it('should find Idoso', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);

    const found = await service.findOne(1);
    expect(found.id).toEqual(1);
  });

  it('should remove Idoso', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

    const removed = await service.remove(1);
    expect(removed.id).toEqual(1);
  });

  it('should update Idoso', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, nome: 'Henrique' } as any);

    const found = await service.update(1, { nome: 'Henrique' });
    expect(found).toEqual({ id: 1, nome: 'Henrique' });
  });

  it('should update Idoso with photo', async () => {
    jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    jest
      .spyOn(repository, 'save')
      .mockReturnValue({ id: 1, nome: 'Henrique', foto: '1' } as any);

    const found = await service.update(1, { nome: 'Henrique' });
    expect(found).toEqual({
      id: 1,
      nome: 'Henrique',
      foto: '1',
    });
  });

  describe('findAll', () => {
    const idoso = {
      id: 1,
      nome: 'Henrique',
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

    it('should findAll Idoso', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
        where: () => ({
          limit: () => ({
            offset: () => ({
              orderBy: () => ({
                getManyAndCount: jest.fn().mockResolvedValueOnce([[idoso], 1]),
              }),
            }),
          }),
        }),
      } as any);

      const { data, count } = await service.findAll({}, ordering, pagination);
      expect(count).toEqual(1);
      expect((data as Idoso[])[0]).toEqual(idoso);
    });
  });
});
