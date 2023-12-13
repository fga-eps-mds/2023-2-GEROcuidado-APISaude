import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import { getWhereClauseNumber } from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { CreateValorMetricaDto } from './dto/create-valorMetrica-dto';
import { ValorMetrica } from './entities/valorMetrica.entity';
import { IValorMetricaFilter } from './interfaces/valorMetrica-filter.interface';

@Injectable()
export class ValorMetricaService {
  constructor(
    @InjectRepository(ValorMetrica)
    private readonly _repository: Repository<ValorMetrica>,
  ) {}

  async create(body: CreateValorMetricaDto): Promise<ValorMetrica> {
    const valorMetrica = new ValorMetrica(body);
    return this._repository.save(valorMetrica);
  }

  async findOne(id: number) {
    const metrica = await this._repository.findOneOrFail({ where: { id } });
    return metrica;
  }

  async findAll(
    filter: IValorMetricaFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<ValorMetrica[]>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('valorMetrica')
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

  private buildWhereClause(filter: IValorMetricaFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseNumber(filter.idMetrica, '"idMetrica"');

    return whereClause;
  }

  async remove(id: number) {
    const found = await this._repository.findOneOrFail({ where: { id } });
    return this._repository.remove(found);
  }
}
