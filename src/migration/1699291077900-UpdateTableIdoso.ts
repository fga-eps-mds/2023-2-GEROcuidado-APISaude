import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableIdoso1699291077900 implements MigrationInterface {
  name = 'UpdateTableIdoso1699291077900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "idoso" ADD "foto" bytea`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "idoso" DROP COLUMN "foto"`);
  }
}
