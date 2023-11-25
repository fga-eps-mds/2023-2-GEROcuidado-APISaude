import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRotinaDto } from '../rotina/dto/create-rotina.dto';
import { Rotina } from '../rotina/entities/rotina.entity';
import { Filtering } from '../shared/decorators/filtrate.decorator';
import { Ordering, OrderParams } from '../shared/decorators/ordenate.decorator';
import {
  Pagination,
  PaginationParams,
} from '../shared/decorators/paginate.decorator';
import { ETipoSanguineo } from './classes/tipo-sanguineo.enum';
import { Idoso } from './entities/idoso.entity';
import { IdosoController } from './idoso.controller';
import { IdosoService } from './idoso.service';
import { IIdosoFilter } from './interfaces/idoso-filter.interface';

describe('IdosoController', () => {
  let controller: IdosoController;
  let service: IdosoService;

  const idosoDto = {
    nome: 'Henrique',
    foto: '1',
    idUsuario: 1,
    dataNascimento: new Date(),
    tipoSanguineo: ETipoSanguineo.AB_Negativo,
    telefoneResponsavel: '123456789',
    descricao: 'desc',
    dataHora: new Date().toISOString() as any,
    rotinas: new Rotina(new CreateRotinaDto()) as any,
  };

  const idoso = {
    ...idosoDto,
    id: 1,
    foto: Buffer.from('1'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [IdosoController],
      providers: [
        {
          provide: IdosoService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            update: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Idoso),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<IdosoController>(IdosoController);
    service = module.get<IdosoService>(IdosoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create Idoso', async () => {
    jest
      .spyOn(service, 'create')
      .mockReturnValue(Promise.resolve(idoso as Idoso));

    const response = await controller.create(idosoDto);
    expect(response.data).toEqual(idoso);
    expect(response.message).toEqual('Salvo com sucesso!');
  });

  it('should find Idoso', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockReturnValue(Promise.resolve(idoso as Idoso));

    const response = await controller.findOne({ id: 1 });
    expect(response).toEqual(idoso);
  });

  it('should remove Idoso', async () => {
    jest
      .spyOn(service, 'remove')
      .mockReturnValue(Promise.resolve(idoso as Idoso));

    const response = await controller.remove({ id: 1 });
    expect(response.data).toEqual(idoso);
    expect(response.message).toEqual('Excluído com sucesso!');
  });

  it('should update Idoso', async () => {
    jest
      .spyOn(service, 'update')
      .mockReturnValue(Promise.resolve(idoso as Idoso));

    const response = await controller.update({ id: 1 }, { nome: 'Henrique' });
    expect(response.data).toEqual(idoso);
    expect(response.message).toEqual('Atualizado com sucesso!');
  });

  describe('findAll', () => {
    const filter: IIdosoFilter = {
      nome: 'Henrique',
      id: 1,
    };
    const filtering = new Filtering<IIdosoFilter>(JSON.stringify(filter));

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
      const expected = { data: [idoso], count: 1, pageSize: 1 };

      jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(expected));

      const { data, count, pageSize } = await controller.findAll(
        filtering,
        pagination,
        ordering,
      );

      expect(count).toEqual(1);
      expect(pageSize).toEqual(1);
      expect(data).toEqual([idoso]);
    });
  });
});
