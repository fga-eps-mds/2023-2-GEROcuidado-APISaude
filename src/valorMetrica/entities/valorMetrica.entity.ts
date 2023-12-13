import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Metrica } from '../../metrica/entities/metrica.entity';
import { CreateValorMetricaDto } from '../dto/create-valorMetrica-dto';
import { UpdateValorMetricaDto } from '../dto/update-valorMetrica-dto';

@Entity({ name: 'valorMetrica' })
export class ValorMetrica {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Metrica)
  @JoinColumn({ name: 'idMetrica' })
  idMetrica!: number;

  @Column('varchar', { length: 10 })
  valor!: string;

  @Column('timestamp')
  dataHora!: Date;

  constructor(
    createValorMetricaDto: CreateValorMetricaDto | UpdateValorMetricaDto,
  ) {
    Object.assign(this, createValorMetricaDto);
  }
}
