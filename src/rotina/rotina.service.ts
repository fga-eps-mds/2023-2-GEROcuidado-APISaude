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
    const sort = ordering.column;
    const offset = paging.offset;
    const order = ordering.dir.toUpperCase() as 'ASC' | 'DESC';
    const where = this.buildWhereClause(filter);
    const limit = paging.limit;

    const [result, total] = await this._repository
      .createQueryBuilder('rotinas')
      .where(`${where}`)
      .limit(limit)
      .offset(offset)
      .orderBy(`"${sort}"`, order)
      .getManyAndCount();

    return {
      count: +total,
      pageSize: +total,
      data: result,
    };
  }

  private buildWhereClause(filter: IRotinaFilter): string {
    let whereClause = '1 = 1 ';

    whereClause += getWhereClauseNumber(filter.id, 'id');
    whereClause += getWhereClauseNumber(filter.idIdoso, '"idIdoso"');
    whereClause += this.getWhereClauseDate(filter.dataHora);

    return whereClause;
  }

  private getWhereClauseDate(value: string | undefined): string {
    if (!value || value.length < 1) return '';

    const date = new Date(value);
    const weekday = date.getDay();

    const start = new Date(value);
    start.setUTCHours(0, 0, 0);
    const startString = start.toISOString();

    const end = new Date(value);
    end.setUTCHours(23, 59, 59);
    const endString = end.toISOString();

    return ` AND (("dataHora"::date BETWEEN '${startString}'::date AND '${endString}'::date) OR ("dias" && '{${weekday}}'::rotina_dias_enum[]))`;
  }

  async remove(id: number) {
    const found = await this._repository.findOneOrFail({ where: { id } });
    return this._repository.remove(found);
  }

  async findAllToCron(): Promise<Rotina[]> {
    const [data, hora] = new Date()
      .toLocaleString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      .split(' ');

    const dataStringArray = data.replace(',', '').split('/');
    const dataString = `${dataStringArray[2]}-${dataStringArray[1]}-${dataStringArray[0]}`;
    const startString = `${dataString}T00:00:00.000Z`;
    const endString = `${dataString}T23:59:59.000Z`;
    const weekday = new Date(`${dataString}T00:00:00.000`).getDay();

    const where = `"notificacao" = ${true} AND (("dataHora"::date BETWEEN '${startString}'::date AND '${endString}'::date) OR (dias && '{${weekday}}'::rotina_dias_enum[])) AND lpad(date_part('hour', "dataHora")::text, 2, '0') || ':' || lpad(date_part('minute', "dataHora")::text, 2, '0') = '${hora}'`;

    return this._repository
      .createQueryBuilder('rotinas')
      .where(where)
      .getMany();
  }
}
