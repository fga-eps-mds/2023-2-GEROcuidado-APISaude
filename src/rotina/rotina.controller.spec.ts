import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { OrderParams, Ordering } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { ECategoriaRotina } from './classes/categoria-rotina.enum';
import { Rotina } from './entities/rotina.entity';
import { IRotinaFilter } from './interfaces/rotina-filter.interface';
import { RotinaController } from './rotina.controller';
import { RotinaService } from './rotina.service';

describe('RotinaController', () => {
  let controller: RotinaController;
  let service: RotinaService;

  const rotinaDto = {
    idIdoso: 1,
    titulo: 'titulo',
    categoria: ECategoriaRotina.ALIMENTACAO,
    descricao: 'desc',
    dataHora: new Date().toISOString() as any,
    dataHoraConcluidos: [],
    dias: [0, 1],
    token: '',
    notificacao: false,
  };

  const rotina = {
    ...rotinaDto,
    id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [RotinaController],
      providers: [
        {
          provide: RotinaService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Rotina),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<RotinaController>(RotinaController);
    service = module.get<RotinaService>(RotinaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create Idoso', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValue(Promise.resolve(rotina as Rotina));

    const response = await controller.create(rotinaDto);
    expect(response.data).toEqual(rotina);
    expect(response.message).toEqual('Salvo com sucesso!');
  });

  it('should find Idoso', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(rotina as Rotina));

    const response = await controller.findOne({ id: 1 });
    expect(response).toEqual(rotina);
  });

  it('should remove Idoso', async () => {
    jest
      .spyOn(service, 'remove')
      .mockReturnValue(Promise.resolve(rotina as Rotina));

    const response = await controller.remove({ id: 1 });
    expect(response.data).toEqual(rotina);
    expect(response.message).toEqual('Excluído com sucesso!');
  });

  it('should update Idoso', async () => {
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(rotina as Rotina));

    const response = await controller.update({ id: 1 }, { titulo: 'Titulo 2' });
    expect(response.data).toEqual(rotina);
    expect(response.message).toEqual('Atualizado com sucesso!');
  });

  describe('findAll', () => {
    const filter: IRotinaFilter = {
      dataHora: new Date().toISOString(),
      idIdoso: 1,
      id: 1,
    };
    const filtering = new Filtering<Rotina>(JSON.stringify(filter));

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
      const expected = { data: [rotina], count: 1, pageSize: 1 };

      jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(expected));

      const { data, count, pageSize } = await controller.findAll(
        filtering as any,
        pagination,
        ordering,
      );

      expect(count).toEqual(1);
      expect(pageSize).toEqual(1);
      expect(data).toEqual([rotina]);
    });
  });
});
