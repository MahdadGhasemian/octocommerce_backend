import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1732338914399 implements MigrationInterface {
    name = 'Store1732338914399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "warehouse" ADD "is_virtualy" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stock" ADD "available_quantity" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stock" DROP COLUMN "available_quantity"`);
        await queryRunner.query(`ALTER TABLE "warehouse" DROP COLUMN "is_virtualy"`);
    }

}
