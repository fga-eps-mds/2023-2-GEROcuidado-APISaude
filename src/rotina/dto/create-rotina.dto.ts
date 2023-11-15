import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength
} from 'class-validator';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';
  export class CreateRotinaDto
  {
    @IsNumber()
    @IsNotEmpty()
    idPaciente!: number;

    @IsNotEmpty()
    @IsEnum(ECategoriaRotina)
    categoria?: ECategoriaRotina;

    @IsDateString()
    @IsNotEmpty()
    dataHora!: Date;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    titulo?: string;

    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    descricao?: string;
  }