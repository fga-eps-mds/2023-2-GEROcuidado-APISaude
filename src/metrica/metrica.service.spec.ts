import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetricaService } from './metrica.service';
import { Metrica } from './entities/metrica.entity';
import { CreateMetricaDto } from './dto/create-metrica-dto';
import { UpdateMetricaDto } from './dto/update-metrica-dto';
import { ECategoriaMetrica } from './classes/tipo-metrica.enum';


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

});