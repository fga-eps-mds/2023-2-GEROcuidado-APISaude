import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableIdosoAndrotina1700863027631
  implements MigrationInterface
{
  name = 'AlterTableIdosoAndrotina1700863027631';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "idPaciente"`);
    await queryRunner.query(`ALTER TABLE "rotina" ADD "idIdoso" integer`);
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "dias"`);
    await queryRunner.query(
      `CREATE TYPE "public"."rotina_dias_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dias" "public"."rotina_dias_enum" array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD CONSTRAINT "FK_2d6a9e702b76cd983428672bdb0" FOREIGN KEY ("idIdoso") REFERENCES "idoso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rotina" DROP CONSTRAINT "FK_2d6a9e702b76cd983428672bdb0"`,
    );
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "dias"`);
    await queryRunner.query(`DROP TYPE "public"."rotina_dias_enum"`);
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "dias" integer array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(`ALTER TABLE "rotina" DROP COLUMN "idIdoso"`);
    await queryRunner.query(
      `ALTER TABLE "rotina" ADD "idPaciente" integer NOT NULL`,
    );
  }
}
