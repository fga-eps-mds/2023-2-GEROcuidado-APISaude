import { PartialType } from '@nestjs/mapped-types';
import { CreateRotinaDto } from './create-rotina.dto';

export class UpdateRotinaDto extends PartialType(CreateRotinaDto) {}
