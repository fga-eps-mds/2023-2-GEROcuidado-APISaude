import { PartialType } from '@nestjs/mapped-types';
import { CreateMetricaDto } from './create-metrica-dto';

export class UpdateMetricaDto extends PartialType(CreateMetricaDto) {}
