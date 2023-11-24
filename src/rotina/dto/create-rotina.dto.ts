import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';
export class CreateRotinaDto {
  @IsNumber()
  @IsNotEmpty()
  idPaciente!: number;

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

  //precisa fazer o do concluido

  @IsArray()
  @IsOptional()
  dias?: number[]; 
}