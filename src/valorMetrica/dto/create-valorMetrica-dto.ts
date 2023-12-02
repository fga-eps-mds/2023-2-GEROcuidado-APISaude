import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateValorMetricaDto {

    @IsNotEmpty()
    @IsNumber()
    idMetrica!: number;

    @IsNotEmpty()
    @IsNumber()
    valor!: number;

    @IsDateString()
    @IsNotEmpty()
    dataHora!: Date;

}