import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ECategoriaRotina } from '../classes/categoria-rotina.enum';

@Entity({ name: 'rotina' })
export class Rotina {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    idPaciente!: number;

    @Column('enum', { enum: ECategoriaRotina })
    categoria!: ECategoriaRotina;

    // como sera o tipo dos dias da semana ?
    // a data e a hora, serao juntas?

    @Column('timestamp')
    dataHora!: Date;
    
    @Column('varchar', { length: 100 })
    titulo!: string;

    @Column('varchar', { length: 100 })
    descricao?: string;
}