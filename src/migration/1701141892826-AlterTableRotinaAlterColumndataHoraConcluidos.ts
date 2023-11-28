import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableRotinaAlterColumndataHoraConcluidos1701141892826
  implements MigrationInterface
{
  name = 'AlterTableRotinaAlterColumndataHoraConcluidos1701141892826';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" DROP COLUMN "dataHoraConcluidos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dataHoraConcluidos" character varying array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" DROP COLUMN "dataHoraConcluidos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dataHoraConcluidos" TIMESTAMP array NOT NULL DEFAULT '{}'`,
    );
  }
}
