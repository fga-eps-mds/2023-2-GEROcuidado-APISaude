import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { ECategoriaMetrica } from "../classes/tipo-metrica.enum";

export class CreateMetricaDto {
    @IsNotEmpty()
    @IsNumber()
    idIdoso!: number;

    @IsNotEmpty()
    @IsEnum(ECategoriaMetrica)
    categoria?: ECategoriaMetrica;
}