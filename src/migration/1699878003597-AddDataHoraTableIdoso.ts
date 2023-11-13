import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataHoraTableIdoso1699878003597 implements MigrationInterface {
    name = 'AddDataHoraTableIdoso1699878003597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "idoso" ADD "dataHora" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "idoso" DROP COLUMN "dataHora"`);
    }

}
