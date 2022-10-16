import { MigrationInterface, QueryRunner } from "typeorm";

export class createTables1663895327095 implements MigrationInterface {
  name = "createTables1663895327095";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(
      `CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(127) NOT NULL, "email" character varying(127), "phone_number" character varying(127), "clientId" uuid, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(127) NOT NULL, "email" character varying(127) NOT NULL, "password" character varying(16) NOT NULL, "phone_number" character varying(127) NOT NULL, "is_adm" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6436cc6b79593760b9ef921ef12" UNIQUE ("email"), CONSTRAINT "UQ_188451e32438416af3efdd0254a" UNIQUE ("phone_number"), CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_e99f8e5bcbccaec7b0b7ed65526" FOREIGN KEY ("clientId") REFERENCES "client"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_e99f8e5bcbccaec7b0b7ed65526"`
    );
    await queryRunner.query(`DROP TABLE "client"`);
    await queryRunner.query(`DROP TABLE "contact"`);
  }
}
