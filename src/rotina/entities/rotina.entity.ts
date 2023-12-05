import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Idoso } from '../../idoso/entities/idoso.entity';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';
import { EDiasSemana } from '../classes/dias-semana.enum';
import { CreateRotinaDto } from '../dto/create-rotina.dto';
import { UpdateRotinaDto } from '../dto/update-rotina.dto';

@Entity({ name: 'rotina' })
export class Rotina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { length: 100 })
  titulo!: string;

  @Column('enum', { enum: ECategoriaRotina })
  categoria!: ECategoriaRotina;

  @Column('enum', { enum: EDiasSemana, array: true, default: [] })
  dias!: EDiasSemana[];

  @Column('timestamp')
  dataHora!: Date;

  @Column('varchar', { length: 100, nullable: true })
  descricao!: string;

  @Column('varchar', { length: 100, nullable: true })
  token!: string;

  @Column('boolean', { default: false })
  notificacao!: boolean;

  @Column('varchar', { array: true, default: [] })
  dataHoraConcluidos!: string[];

  @ManyToOne(() => Idoso)
  @JoinColumn({ name: 'idIdoso' })
  idIdoso!: number;

  constructor(createRotinaDto: CreateRotinaDto | UpdateRotinaDto) {
    Object.assign(this, createRotinaDto);
  }
}
