import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRotina1700415713319 implements MigrationInterface {
  name = 'CreateTableRotina1700415713319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."rotina_categoria_enum" AS ENUM('Geral', 'Alimentação', 'Exercícios', 'Medicamentos', 'Água', 'Compromissos')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rotina" ("id" SERIAL NOT NULL, "idPaciente" integer NOT NULL, "categoria" "public"."rotina_categoria_enum" NOT NULL, "dataHora" TIMESTAMP NOT NULL, "titulo" character varying(100) NOT NULL, "descricao" character varying(100) NOT NULL, CONSTRAINT "PK_dda374a9512c52ad46707571b57" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "rotina"`);
    await queryRunner.query(`DROP TYPE "public"."rotina_categoria_enum"`);
  }
}
