import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import { getWhereClauseNumber } from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { CreateMetricaDto } from './dto/create-metrica-dto';
import { UpdateMetricaDto } from './dto/update-metrica-dto';
import { Metrica } from './entities/metrica.entity';
import { IMetricaFilter } from './interfaces/metrica-filter.interface';

@Injectable()
export class MetricaService {
  constructor(
    @InjectRepository(Metrica)
    private readonly _repository: Repository<Metrica>,
  ) {}

  async create(body: CreateMetricaDto): Promise<Metrica> {
    const metrica = new Metrica(body);
    return this._repository.save(metrica);
  }

  async findOne(id: number) {
    return this._repository.findOneOrFail({ where: { id } });
  }

  async getSomaHidratacao(id: number) {
    const start = new Date();
    start.setUTCHours(0, 0, 0);
    const startString = start.toISOString();

    const end = new Date();
    end.setUTCHours(23, 59, 59);
    const endString = end.toISOString();

    const result = (await this._repository
      .createQueryBuilder('metrica')
      .leftJoinAndSelect('metrica.valoresMetricas', 'valoresMetricas')
      .select('valoresMetricas.valor AS valor')
      .where('metrica.id = :id', { id })
      .andWhere(
        `"valoresMetricas"."dataHora"::date BETWEEN '${startString}'::date AND '${endString}'::date`,
      )
      .getRawMany()) as { valor: string }[];

    return result.reduce((accumulator, valorMetrica) => {
      return accumulator + Number(valorMetrica.valor);
    }, 0);
  }

  async update(id: number, body: UpdateMetricaDto): Promise<Metrica> {
    const found = await this.findOne(id);
    const merged = Object.assign(found, body);

    const updated = await this._repository.save(merged);

    return updated;
  }

  async findAll(
    filter: IMetricaFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<Metrica[]>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('metrica')
      .where(`${where}`)
      .limit(limit)
      .offset(offset)
      .orderBy(`"${sort}"`, order)
      .getManyAndCount();

    return {
      data: result,
      count: +total,
      pageSize: +total,
    };
  }

  private buildWhereClause(filter: IMetricaFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseNumber(filter.idIdoso, '"idIdoso"');

    return whereClause;
  }

  async remove(id: number) {
    const found = await this._repository.findOneOrFail({ where: { id } });
    return this._repository.remove(found);
  }
}
