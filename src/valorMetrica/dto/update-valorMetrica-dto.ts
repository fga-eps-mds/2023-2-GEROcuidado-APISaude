import { PartialType } from '@nestjs/mapped-types';
import { CreateValorMetricaDto } from './create-valorMetrica-dto';

export class UpdateValorMetricaDto extends PartialType(CreateValorMetricaDto) {}
