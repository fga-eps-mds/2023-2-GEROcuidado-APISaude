import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HttpResponse } from '../shared/classes/http-response';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { IdValidator } from '../shared/validators/id.validator';
import { CreateIdosoDto } from './dto/create-idoso-dto';
import { UpdateIdosoDto } from './dto/update-idoso.dto';
import { Idoso } from './entities/idoso.entity';
import { IdosoService } from './idoso.service';
import { IIdosoFilter } from './interfaces/idoso-filter.interface';

@Controller('idoso')
export class IdosoController {
  constructor(private readonly _service: IdosoService) {}

  @Get()
  @PublicRoute()
  async findAll(
    @Filtrate() queryParam: Filtering<IIdosoFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<Idoso[]>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }

  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Idoso> {
    return this._service.findOne(param.id);
  }

  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() body: UpdateIdosoDto,
  ): Promise<Response<Idoso>> {
    const updated = await this._service.update(param.id, body);
    return new HttpResponse<Idoso>(updated).onUpdated();
  }

  @Post()
  async create(@Body() body: CreateIdosoDto) {
    const created = await this._service.create(body);
    return new HttpResponse<Idoso>(created).onCreated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }
}
