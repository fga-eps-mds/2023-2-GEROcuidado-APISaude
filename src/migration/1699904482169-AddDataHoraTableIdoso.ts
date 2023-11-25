import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDataHoraTableIdoso1699904482169 implements MigrationInterface {
  name = 'AddDataHoraTableIdoso1699904482169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "idoso" ADD "dataHora" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "idoso" DROP COLUMN "dataHora"`);
  }
}
