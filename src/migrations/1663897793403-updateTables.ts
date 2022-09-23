import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTables1663897793403 implements MigrationInterface {
    name = 'updateTables1663897793403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "client" ADD "password" character varying(16) NOT NULL`);
    }

}
