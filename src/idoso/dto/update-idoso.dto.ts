import { PartialType } from '@nestjs/mapped-types';
import { CreateIdosoDto } from './create-idoso-dto';

export class UpdateIdosoDto extends PartialType(CreateIdosoDto) {}
