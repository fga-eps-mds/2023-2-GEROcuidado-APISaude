import {
    IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,
    MaxLength,
    MinLength
} from 'class-validator';
import { ETipoSanguineoIdoso } from "../classes/tipoSanguineo-idoso.enum";

export class CreateIdosoDto {
    @IsNumber()
    @IsNotEmpty()
    idUsuario!: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(60)
    @MinLength(5)  
    nome!: string;

    @IsDateString()
    @IsNotEmpty()
    dataNascimento!: Date;

    @IsOptional()
    @IsEnum(ETipoSanguineoIdoso)
    tipoSanguineo?: ETipoSanguineoIdoso;

    @IsString()
    @IsNotEmpty()
    @MinLength(11) 
    @MaxLength(11)
    telefoneResponsavel!: string;

    @IsString()
    @MaxLength(500)
    @IsNotEmpty()
    descricao?: string;
}