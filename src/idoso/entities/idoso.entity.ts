import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rotina } from '../../rotina/entities/rotina.entity';
import { ETipoSanguineo } from '../classes/tipo-sanguineo.enum';
import { CreateIdosoDto } from '../dto/create-idoso-dto';
import { UpdateIdosoDto } from '../dto/update-idoso.dto';

@Entity({ name: 'idoso' })
export class Idoso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('integer')
  idUsuario!: number;

  @Column('bytea', { nullable: true })
  foto!: Buffer;

  @Column('varchar', { length: 60 })
  nome!: string;

  @Column('timestamp')
  dataNascimento!: Date;

  @Column('enum', { enum: ETipoSanguineo, nullable: true })
  tipoSanguineo!: ETipoSanguineo;

  @Column('varchar', { length: 11 })
  telefoneResponsavel!: string;

  @Column('varchar', { length: 500, nullable: true })
  descricao!: string;

  @Column('timestamp', { nullable: true })
  dataHora!: Date;

  @OneToMany(() => Rotina, (rotina) => rotina.idIdoso)
  rotinas!: Rotina[];

  constructor(createIdosoDto: CreateIdosoDto | UpdateIdosoDto) {
    Object.assign(this, createIdosoDto);
  }
}
