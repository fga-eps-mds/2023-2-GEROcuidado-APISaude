import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Idoso } from '../../idoso/entities/idoso.entity';
import { ValorMetrica } from '../../valorMetrica/entities/valorMetrica.entity';
import { ECategoriaMetrica } from '../classes/tipo-metrica.enum';
import { CreateMetricaDto } from '../dto/create-metrica-dto';
import { UpdateMetricaDto } from '../dto/update-metrica-dto';

@Entity({ name: 'metrica' })
export class Metrica {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Idoso)
  @JoinColumn({ name: 'idIdoso' })
  idIdoso!: number;

  @OneToMany(() => ValorMetrica, (valorMetrica) => valorMetrica.idMetrica)
  valoresMetricas!: ValorMetrica[];

  @Column('enum', { enum: ECategoriaMetrica })
  categoria!: ECategoriaMetrica;

  @Column('varchar', { length: 20, nullable: true })
  valorMaximo?: string;

  constructor(createMetricaDto: CreateMetricaDto | UpdateMetricaDto) {
    Object.assign(this, createMetricaDto);
  }
}
