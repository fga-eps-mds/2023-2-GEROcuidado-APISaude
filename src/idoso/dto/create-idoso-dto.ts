import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ETipoSanguineo } from '../classes/tipo-sanguineo.enum';

export class CreateIdosoDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario!: number;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @MinLength(5)
  nome!: string;

  @IsDateString()
  @IsNotEmpty()
  dataNascimento!: Date;

  @IsOptional()
  @IsEnum(ETipoSanguineo)
  tipoSanguineo?: ETipoSanguineo;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(11)
  telefoneResponsavel!: string;

  @IsString()
  @MaxLength(500)
  @IsOptional()
  descricao?: string;

  @IsDateString()
  @IsOptional()
  dataHora!: Date;
}
