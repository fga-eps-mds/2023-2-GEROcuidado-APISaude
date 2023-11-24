import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';
import { CreateRotinaDto } from '../dto/create-rotina.dto';
import { UpdateRotinaDto } from '../dto/update-rotina.dto';

@Entity({ name: 'rotina' })
export class Rotina {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    // @ManyToOne(() => Idoso)
    // @JoinColumn({ name: 'idPaciente' })
    idPaciente!: number;

    @Column('varchar', { length: 100 })
    titulo!: string;

    @Column('enum', { enum: ECategoriaRotina })
    categoria!: ECategoriaRotina;

    @Column('integer', { array: true, default: [] })
    dias?: number[]; 

    @Column('timestamp')
    dataHora!: Date;

    @Column('varchar', { length: 100, nullable: true })
    descricao?: string;

    @Column({type: 'boolean',default:false})
    concluido?: boolean;

    constructor(createRotinaDto: CreateRotinaDto | UpdateRotinaDto) {
        Object.assign(this, createRotinaDto);
    }
}