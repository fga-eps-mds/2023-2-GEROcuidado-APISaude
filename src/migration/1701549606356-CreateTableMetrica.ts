import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableMetrica1701549606356 implements MigrationInterface {
  name = 'CreateTableMetrica1701549606356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."metrica_categoria_enum" AS ENUM('Frequência Cardíaca', 'Pressão', 'Temperatura', 'Peso', 'Glicemia', 'Saturação')`,
    );
    await queryRunner.query(
      `CREATE TABLE "metrica" ("id" SERIAL NOT NULL, "categoria" "public"."metrica_categoria_enum" NOT NULL, "idIdoso" integer, CONSTRAINT "PK_37eda6d5162b9305738916e1712" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrica" ADD CONSTRAINT "FK_574d03daab9657eaa6cc7d5d726" FOREIGN KEY ("idIdoso") REFERENCES "idoso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "metrica" DROP CONSTRAINT "FK_574d03daab9657eaa6cc7d5d726"`,
    );
    await queryRunner.query(`DROP TABLE "metrica"`);
    await queryRunner.query(`DROP TYPE "public"."metrica_categoria_enum"`);
  }
}
