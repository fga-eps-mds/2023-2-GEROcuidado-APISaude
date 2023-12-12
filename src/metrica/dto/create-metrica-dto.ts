import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ECategoriaMetrica } from '../classes/tipo-metrica.enum';

export class CreateMetricaDto {
  @IsNotEmpty()
  @IsNumber()
  idIdoso!: number;

  @IsNotEmpty()
  @IsEnum(ECategoriaMetrica)
  categoria?: ECategoriaMetrica;

  @IsOptional()
  @IsString()
  valorMaximo?: string;
}
