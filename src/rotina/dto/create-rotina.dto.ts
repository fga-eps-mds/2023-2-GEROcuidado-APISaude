import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';
import { EDiasSemana } from '../classes/dias-semana.enum';
export class CreateRotinaDto {
  @IsNotEmpty()
  @IsNumber()
  idIdoso!: number;

  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  titulo?: string;

  @IsNotEmpty()
  @IsEnum(ECategoriaRotina)
  categoria?: ECategoriaRotina;

  @IsDateString()
  @IsNotEmpty()
  dataHora!: Date;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  descricao?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  token?: string;

  @IsBoolean()
  @IsOptional()
  notificacao?: boolean;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  dataHoraConcluidos?: string[];

  @IsArray()
  @IsEnum(EDiasSemana, { each: true })
  dias?: EDiasSemana[];
}
