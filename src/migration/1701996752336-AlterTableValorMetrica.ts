import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableValorMetrica1701996752336 implements MigrationInterface {
  name = 'AlterTableValorMetrica1701996752336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."metrica_categoria_enum" RENAME TO "metrica_categoria_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metrica_categoria_enum" AS ENUM('Frequência Cardíaca', 'Pressão', 'Temperatura', 'Peso', 'Glicemia', 'Saturação', 'Horas Dormidas', 'Altura', 'IMC')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrica" ALTER COLUMN "categoria" TYPE "public"."metrica_categoria_enum" USING "categoria"::"text"::"public"."metrica_categoria_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."metrica_categoria_enum_old"`);
    await queryRunner.query(`ALTER TABLE "valorMetrica" DROP COLUMN "valor"`);
    await queryRunner.query(
      `ALTER TABLE "valorMetrica" ADD "valor" character varying(10) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "valorMetrica" DROP COLUMN "valor"`);
    await queryRunner.query(
      `ALTER TABLE "valorMetrica" ADD "valor" double precision NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."metrica_categoria_enum_old" AS ENUM('Frequência Cardíaca', 'Pressão', 'Temperatura', 'Peso', 'Glicemia', 'Saturação')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metrica" ALTER COLUMN "categoria" TYPE "public"."metrica_categoria_enum_old" USING "categoria"::"text"::"public"."metrica_categoria_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."metrica_categoria_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."metrica_categoria_enum_old" RENAME TO "metrica_categoria_enum"`,
    );
  }
}
