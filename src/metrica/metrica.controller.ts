import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { MetricaService } from './metrica.service';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { Metrica } from './entities/metrica.entity';
import { IdValidator } from '../shared/validators/id.validator';
import { UpdateMetricaDto } from './dto/update-metrica-dto';
import { HttpResponse } from '../shared/classes/http-response';
import { CreateMetricaDto } from './dto/create-metrica-dto';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { IMetricaFilter } from './interfaces/metrica-filter.interface';

@Controller('metrica')
export class MetricaController {
  constructor(private readonly _service: MetricaService) {}

  @Get()
  @PublicRoute()
  async findAll(
    @Filtrate() queryParam: Filtering<IMetricaFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<Metrica[]>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }
  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<Metrica> {
    return this._service.findOne(param.id);
  }
  @Patch(':id')
  async update(
    @Param() param: IdValidator,
    @Body() body: UpdateMetricaDto,
  ): Promise<Response<Metrica>> {
    const updated = await this._service.update(param.id, body);
    return new HttpResponse<Metrica>(updated).onUpdated();
  }
  @Post()
  async create(@Body() body: CreateMetricaDto) {
    const created = await this._service.create(body);
    return new HttpResponse<Metrica>(created).onCreated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }
}
