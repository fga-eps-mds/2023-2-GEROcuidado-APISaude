import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableRotina1700794599958 implements MigrationInterface {
  name = 'AlterTableRotina1700794599958';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dias" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "concluido" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "concluido"`);
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "dias"`);
  }
}
