import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import { getWhereClauseNumber } from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { CreateRotinaDto } from './dto/create-rotina.dto';
import { UpdateRotinaDto } from './dto/update-rotina.dto';
import { Rotina } from './entities/rotina.entity';
import { IRotinaFilter } from './interfaces/rotina-filter.interface';

@Injectable()
export class RotinaService {
  constructor(
    @InjectRepository(Rotina)
    private readonly _repository: Repository<Rotina>,
  ) {}

  async create(body: CreateRotinaDto): Promise<Rotina> {
    const rotina = new Rotina(body);
    return this._repository.save(rotina);
  }

  async findOne(id: number) {
    const rotina = await this._repository.findOneOrFail({ where: { id } });
    return rotina;
  }

  async update(id: number, body: UpdateRotinaDto): Promise<Rotina> {
    const found = await this.findOne(id);
    const merged = Object.assign(found, body);

    const updated = await this._repository.save(merged);

    return updated;
  }

  async findAll(
    filter: IRotinaFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<Rotina[]>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('rotinas')
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

  private buildWhereClause(filter: IRotinaFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseNumber(filter.id, 'id');
    whereClause += getWhereClauseNumber(filter.idIdoso, '"idIdoso"');

    return whereClause;
  }

  async remove(id: number) {
    const found = await this._repository.findOneOrFail({ where: { id } });
    return this._repository.remove(found);
  }
}
