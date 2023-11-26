import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDescricaoRotina1700418953821 implements MigrationInterface {
  name = 'UpdateDescricaoRotina1700418953821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" ALTER COLUMN "descricao" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" ALTER COLUMN "descricao" SET NOT NULL`,
    );
  }
}
