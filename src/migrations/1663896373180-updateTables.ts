import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTables1663896373180 implements MigrationInterface {
    name = 'updateTables1663896373180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "is_adm"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client" ADD "is_adm" boolean DEFAULT false`);
    }

}
