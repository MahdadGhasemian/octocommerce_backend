import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1731822334088 implements MigrationInterface {
    name = 'Store1731822334088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_amount" numeric(15,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_amount"`);
    }

}
