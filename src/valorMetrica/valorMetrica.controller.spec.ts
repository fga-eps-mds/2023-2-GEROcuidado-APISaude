import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination, PaginationParams } from '../shared/decorators/paginate.decorator';
import { ValorMetrica } from './entities/valorMetrica.entity';
import { IValorMetricaFilter } from './interfaces/valorMetrica-filter.interface';
import { ValorMetricaController } from './valorMetrica.controller';
import { ValorMetricaService } from './valorMetrica.service';

describe("ValorMetricaController", () => {
    let controller: ValorMetricaController;
    let service: ValorMetricaService;

    const valorMetricaDto = {
        idMetrica: 1,
        valor: "10",
        dataHora: new Date().toISOString() as any,
    }

    const valorMetrica = {
        ...valorMetricaDto,
        id: 1
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            controllers: [ValorMetricaController],
            providers: [
                {
                    provide: ValorMetricaService,
                    useValue: {
                        create: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                        update: jest.fn(),
                        findAll: jest.fn(),
                    },
                },
                {
                    provide: getRepositoryToken(ValorMetrica),
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<ValorMetricaController>(ValorMetricaController);
        service = module.get<ValorMetricaService>(ValorMetricaService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should create ValorMetrica', async () => {
        jest
            .spyOn(service, 'create')
            .mockReturnValue(Promise.resolve(valorMetrica as ValorMetrica));

        const response = await controller.create(valorMetricaDto);
        expect(response.data).toEqual(valorMetrica);
        expect(response.message).toEqual('Salvo com sucesso!');
    });

    it('should find ValorMetrica', async () => {
        jest
            .spyOn(service, 'findOne')
            .mockReturnValue(Promise.resolve(valorMetrica as ValorMetrica));

        const response = await controller.findOne({ id: 1 });
        expect(response).toEqual(valorMetrica);
    });

    it('should remove ValorMetrica', async () => {
        jest
            .spyOn(service, 'remove')
            .mockReturnValue(Promise.resolve(valorMetrica as ValorMetrica));

        const response = await controller.remove({ id: 1 });
        expect(response.data).toEqual(valorMetrica);
        expect(response.message).toEqual('Excluído com sucesso!');
    });

    describe('findAll', () => {
        const filter: IValorMetricaFilter = {
            idMetrica: 1,
        };
        const filtering = new Filtering<IValorMetricaFilter>(JSON.stringify(filter));

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
            const expected = { data: [valorMetrica], count: 1, pageSize: 1 };

            jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(expected));

            const { data, count, pageSize } = await controller.findAll(
                filtering,
                pagination,
                ordering,
            );

            expect(count).toEqual(1);
            expect(pageSize).toEqual(1);
            expect(data).toEqual([valorMetrica]);
        });
    });
})