import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableRotinaAlterColumndataHoraConcluidos1701141143183
  implements MigrationInterface
{
  name = 'AlterTableRotinaAlterColumndataHoraConcluidos1701141143183';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" RENAME COLUMN "concluido" TO "dataHoraConcluidos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" DROP COLUMN "dataHoraConcluidos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dataHoraConcluidos" TIMESTAMP array NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" DROP COLUMN "dataHoraConcluidos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dataHoraConcluidos" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" RENAME COLUMN "dataHoraConcluidos" TO "concluido"`,
    );
  }
}
