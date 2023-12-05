import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableRotina1701739100504 implements MigrationInterface {
  name = 'AlterTableRotina1701739100504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "token" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "notificacao" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "notificacao"`);
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "token"`);
  }
}
