import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Body,
} from '@nestjs/common';
import { RotinaService } from './rotina.service';
import { IdValidator } from '../shared/validators/id.validator';
import { Rotina } from './entities/rotina.entity';
import { UpdateRotinaDto } from './dto/update-rotina.dto';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { HttpResponse } from '../shared/classes/http-response';
import { CreateRotinaDto } from './dto/create-rotina.dto';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { IRotinaFilter } from './interfaces/rotina-filter.interface';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';

@Controller('rotina')
export class RotinaController {
  constructor(private readonly _service: RotinaService) {}

  @Get()
  @PublicRoute()
  async findAll(
    @Filtrate() queryParam: Filtering<IRotinaFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<Rotina[]>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }

  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Rotina> {
    return this._service.findOne(param.id);
  }
  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() body: UpdateRotinaDto,
  ): Promise<Response<Rotina>> {
    const updated = await this._service.update(param.id, body);
    return new HttpResponse<Rotina>(updated).onUpdated();
  }

  @Post()
  async create(@Body() body: CreateRotinaDto) {
    const created = await this._service.create(body);
    return new HttpResponse<Rotina>(created).onCreated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }
}
