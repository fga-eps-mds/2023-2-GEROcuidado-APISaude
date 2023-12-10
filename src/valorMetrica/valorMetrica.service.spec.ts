import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
    Pagination,
    PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { ValorMetrica } from './entities/valorMetrica.entity';
import { IValorMetricaFilter } from './interfaces/valorMetrica-filter.interface';
import { ValorMetricaService } from './valorMetrica.service';

describe('ValorMetricaService', () => {
    let service: ValorMetricaService;
    let repository: Repository<ValorMetrica>;

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
                    provide: getRepositoryToken(ValorMetrica),
                    useValue: mockRepository,
                },
                ValorMetricaService,
            ],
        }).compile();

        service = module.get<ValorMetricaService>(ValorMetricaService);
        repository = module.get<Repository<ValorMetrica>>(getRepositoryToken(ValorMetrica));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create ValorMetrica', async () => {
        const valorMetrica = { idMetrica: 1 } as any;
        jest.spyOn(repository, 'save').mockReturnValue({ id: 1 } as any);
        const created = await service.create(valorMetrica);
        expect(created.id).toEqual(1);
    });

    it('should find ValorMetrica', async () => {
        jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);

        const found = await service.findOne(1);
        expect(found.id).toEqual(1);
    });

    it('should remove ValorMetrica', async () => {
        jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
        jest.spyOn(repository, 'remove').mockReturnValue({ id: 1 } as any);

        const removed = await service.remove(1);
        expect(removed.id).toEqual(1);
    });

    //   it('should update ValorMetrica', async () => {
    //     jest.spyOn(repository, 'findOneOrFail').mockReturnValue({ id: 1 } as any);
    //     jest
    //       .spyOn(repository, 'save')
    //       .mockReturnValue({ id: 1, idMetrica: 1} as any);

    //     const found = await service.update(1, { idMetrica: 2 });
    //     expect(found).toEqual({ id: 1, idMetrica : 2 });
    //   });

    describe('findAll', () => {
        const valorMetrica = {
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

        const filter: IValorMetricaFilter = {
            idMetrica: 1,
        };
        const filtering = new Filtering<ValorMetrica>(JSON.stringify(filter));

        it('should findAll ValorMetrica', async () => {
            jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
                where: () => ({
                    limit: () => ({
                        offset: () => ({
                            orderBy: () => ({
                                getManyAndCount: jest.fn().mockResolvedValueOnce([[valorMetrica], 1]),
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
            expect((data as ValorMetrica[])[0]).toEqual(valorMetrica);

            const res = await service.findAll({}, ordering, pagination);
            expect(res.count).toEqual(1);
            expect((res.data as ValorMetrica[])[0]).toEqual(valorMetrica);
        });
    });
});
