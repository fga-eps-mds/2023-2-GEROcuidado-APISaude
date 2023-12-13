import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateValorMetricaDto {
  @IsNotEmpty()
  @IsNumber()
  idMetrica!: number;

  @IsNotEmpty()
  @IsString()
  valor!: string;

  @IsDateString()
  @IsNotEmpty()
  dataHora!: Date;
}
