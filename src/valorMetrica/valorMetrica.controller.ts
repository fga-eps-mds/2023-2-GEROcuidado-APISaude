import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ValorMetricaService } from "./valorMetrica.service";
import { Response } from '../shared/interceptors/data-transform.interceptor';
import { PublicRoute } from "../shared/decorators/public-route.decorator";
import { Paginate, Pagination } from "../shared/decorators/paginate.decorator";
import { Ordenate, Ordering } from "../shared/decorators/ordenate.decorator";
import { ResponsePaginate } from "../shared/interfaces/response-paginate.interface";
import { ValorMetrica } from "./entities/valorMetrica.entity";
import { IdValidator } from "../shared/validators/id.validator";
import { CreateValorMetricaDto } from "./dto/create-valorMetrica-dto";
import { HttpResponse } from "../shared/classes/http-response";

@Controller('valorMetrica')
export class ValorMetricaController {
    constructor(private readonly _service: ValorMetricaService) { }

    @Get()
    @PublicRoute()
    async findAll(
        // @Filtrate() queryParam: Filtering<IRotinaFilter>,
        @Paginate() pagination: Pagination,
        @Ordenate() ordering: Ordering,
    ): Promise<ResponsePaginate<ValorMetrica[]>> {
        return this._service.findAll(ordering, pagination);
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