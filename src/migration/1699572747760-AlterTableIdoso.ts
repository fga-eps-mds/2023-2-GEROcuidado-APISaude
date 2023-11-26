import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableIdoso1699572747760 implements MigrationInterface {
  name = 'AlterTableIdoso1699572747760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "idoso" ALTER COLUMN "tipoSanguineo" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "idoso" ALTER COLUMN "descricao" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "idoso" ALTER COLUMN "descricao" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "idoso" ALTER COLUMN "tipoSanguineo" SET NOT NULL`,
    );
  }
}
