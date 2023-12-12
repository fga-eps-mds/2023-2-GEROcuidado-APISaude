import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableMetrica1702413498781 implements MigrationInterface {
  name = 'AlterTableMetrica1702413498781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "metrica" ADD "valorMaximo" character varying(20)`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."metrica_categoria_enum" RENAME TO "metrica_categoria_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metrica_categoria_enum" AS ENUM('Frequência Cardíaca', 'Pressão', 'Temperatura', 'Peso', 'Glicemia', 'Saturação', 'Horas Dormidas', 'Altura', 'IMC', 'Hidratação')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrica" ALTER COLUMN "categoria" TYPE "public"."metrica_categoria_enum" USING "categoria"::"text"::"public"."metrica_categoria_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."metrica_categoria_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."metrica_categoria_enum_old" AS ENUM('Frequência Cardíaca', 'Pressão', 'Temperatura', 'Peso', 'Glicemia', 'Saturação', 'Horas Dormidas', 'Altura', 'IMC')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrica" ALTER COLUMN "categoria" TYPE "public"."metrica_categoria_enum_old" USING "categoria"::"text"::"public"."metrica_categoria_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."metrica_categoria_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."metrica_categoria_enum_old" RENAME TO "metrica_categoria_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "metrica" DROP COLUMN "valorMaximo"`);
  }
}
