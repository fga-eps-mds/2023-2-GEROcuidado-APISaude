import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Idoso } from "../../idoso/entities/idoso.entity";
import { ECategoriaMetrica } from "../classes/tipo-metrica.enum";
import { CreateMetricaDto } from "../dto/create-metrica-dto";
import { UpdateMetricaDto } from "../dto/update-metrica-dto";

@Entity({ name: 'metrica' })
export class Metrica {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Idoso)
    @JoinColumn({ name: 'idIdoso' })
    idIdoso!: number;

    @Column('enum', { enum: ECategoriaMetrica })
    categoria!: ECategoriaMetrica;

    constructor(createMetricaDto: CreateMetricaDto | UpdateMetricaDto) {
        Object.assign(this, createMetricaDto);
    }
}