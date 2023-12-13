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
import { CreateMetricaDto } from './dto/create-metrica-dto';
import { UpdateMetricaDto } from './dto/update-metrica-dto';
import { Metrica } from './entities/metrica.entity';
import { IMetricaFilter } from './interfaces/metrica-filter.interface';
import { MetricaService } from './metrica.service';

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

  @Get('soma-hidratacao/:id')
  async getSomaHidratacao(@Param() param: IdValidator): Promise<number> {
    return this._service.getSomaHidratacao(param.id);
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
