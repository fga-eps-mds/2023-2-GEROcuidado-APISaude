import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ordering } from '../shared/decorators/ordenate.decorator';
import { Pagination } from '../shared/decorators/paginate.decorator';
import {
  getWhereClauseNumber,
  getWhereClauseString,
} from '../shared/helpers/sql-query-helper';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';

import { CreateIdosoDto } from './dto/create-idoso-dto';
import { UpdateIdosoDto } from './dto/update-idoso.dto';
import { Idoso } from './entities/idoso.entity';
import { IIdosoFilter } from './interfaces/idoso-filter.interface';

@Injectable()
export class IdosoService {
  constructor(
    @InjectRepository(Idoso)
    private readonly _repository: Repository<Idoso>,
  ) {}

  async create(body: CreateIdosoDto): Promise<Idoso> {
    const idoso = new Idoso(body);
    return this._repository.save(idoso);
  }

  async findOne(id: number) {
    return this._repository.findOneOrFail({ where: { id } });
  }

  async update(id: number, body: UpdateIdosoDto): Promise<Idoso> {
    const found = await this.findOne(id);
    const merged = Object.assign(found, body);

    return this._repository.save(merged);
  }

  async findAll(
    filter: IIdosoFilter,
    ordering: Ordering,
    paging: Pagination,
  ): Promise<ResponsePaginate<Idoso[]>> {
    const limit = paging.limit;
    const offset = paging.offset;
    const sort = ordering.column;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);

    const [result, total] = await this._repository
      .createQueryBuilder('idoso')
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

  private buildWhereClause(filter: IIdosoFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseString(filter.nome, 'nome');
    whereClause += getWhereClauseNumber(filter.id, 'id');
    whereClause += getWhereClauseNumber(filter.idUsuario, '"idUsuario"');

    return whereClause;
  }

  async remove(id: number) {
    const found = await this._repository.findOneOrFail({ where: { id } });
    return this._repository.remove(found);
  }
}
