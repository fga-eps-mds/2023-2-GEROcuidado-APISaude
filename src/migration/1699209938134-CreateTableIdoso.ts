import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableIdoso1699209938134 implements MigrationInterface {
  name = 'CreateTableIdoso1699209938134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."idoso_tiposanguineo_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')`,
    );
    await queryRunner.query(
      `CREATE TABLE "idoso" ("id" SERIAL NOT NULL, "idUsuario" integer NOT NULL, "nome" character varying(60) NOT NULL, "dataNascimento" TIMESTAMP NOT NULL, "tipoSanguineo" "public"."idoso_tiposanguineo_enum" NOT NULL, "telefoneResponsavel" character varying(11) NOT NULL, "descricao" character varying(500) NOT NULL, CONSTRAINT "PK_a9b234f8e2ba08e4a72313b78f5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "idoso"`);
    await queryRunner.query(`DROP TYPE "public"."idoso_tiposanguineo_enum"`);
  }
}
