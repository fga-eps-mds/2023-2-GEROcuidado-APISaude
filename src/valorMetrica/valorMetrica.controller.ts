import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { HttpResponse } from '../shared/classes/http-response';
import { Filtering, Filtrate } from '../shared/decorators/filtrate.decorator';
import { Ordenate, Ordering } from '../shared/decorators/ordenate.decorator';
import { Paginate, Pagination } from '../shared/decorators/paginate.decorator';
import { PublicRoute } from '../shared/decorators/public-route.decorator';
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { ResponsePaginate } from '../shared/interfaces/response-paginate.interface';
import { IdValidator } from '../shared/validators/id.validator';
import { CreateValorMetricaDto } from './dto/create-valorMetrica-dto';
import { ValorMetrica } from './entities/valorMetrica.entity';
import { IValorMetricaFilter } from './interfaces/valorMetrica-filter.interface';
import { ValorMetricaService } from './valorMetrica.service';

@Controller('valorMetrica')
export class ValorMetricaController {
  constructor(private readonly _service: ValorMetricaService) {}

  @Get()
  @PublicRoute()
  async findAll(
    @Filtrate() queryParam: Filtering<IValorMetricaFilter>,
    @Paginate() pagination: Pagination,
    @Ordenate() ordering: Ordering,
  ): Promise<ResponsePaginate<ValorMetrica[]>> {
    return this._service.findAll(queryParam.filter, ordering, pagination);
  }
  @Get(':id')
  async findOne(@Param() param: IdValidator): Promise<ValorMetrica> {
    return this._service.findOne(param.id);
  }
  @Post()
  async create(@Body() body: CreateValorMetricaDto) {
    const created = await this._service.create(body);
    return new HttpResponse<ValorMetrica>(created).onCreated();
  }

  @Delete(':id')
  async remove(@Param() param: IdValidator): Promise<Response<unknown>> {
    const deleted = await this._service.remove(param.id);
    return new HttpResponse(deleted).onDeleted();
  }
}
