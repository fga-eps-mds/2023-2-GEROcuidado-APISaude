import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ETipoSanguineoIdoso } from '../classes/tipoSanguineo-idoso.enum';
import { CreateIdosoDto } from '../dto/create-idoso-dto';
import { UpdateIdosoDto } from '../dto/update-idoso.dto';

@Entity({ name: 'idoso'})
export class Idoso {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('integer')
    idUsuario!: number;

    @Column('varchar', { length: 60 })
    nome!: string;

    @Column('date')
    dataNascimento!: Date;

    @Column('enum', {enum: ETipoSanguineoIdoso})
    tipoSanguineo?: ETipoSanguineoIdoso;

    @Column('varchar', { length: 11 })
    telefoneResponsavel!: string;

    @Column('varchar', { length: 500 })
    descricao?: string;

    constructor(createIdosoDto: CreateIdosoDto | UpdateIdosoDto) {
        Object.assign(this, createIdosoDto);
      }
}