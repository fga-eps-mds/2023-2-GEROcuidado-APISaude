import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableValorMetrica1701559083238
  implements MigrationInterface
{
  name = 'CreateTableValorMetrica1701559083238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "valorMetrica" ("id" SERIAL NOT NULL, "valor" double precision NOT NULL, "dataHora" TIMESTAMP NOT NULL, "idMetrica" integer, CONSTRAINT "PK_9e8ca5a7cfc9169850aa35d4fe2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "valorMetrica" ADD CONSTRAINT "FK_80f274382900aafd3a667034d46" FOREIGN KEY ("idMetrica") REFERENCES "metrica"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "valorMetrica" DROP CONSTRAINT "FK_80f274382900aafd3a667034d46"`,
    );
    await queryRunner.query(`DROP TABLE "valorMetrica"`);
  }
}
