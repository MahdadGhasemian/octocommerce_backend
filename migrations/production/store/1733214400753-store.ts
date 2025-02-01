import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1733214400753 implements MigrationInterface {
    name = 'Store1733214400753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "discount_percentage" numeric(5,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "discount_amount" numeric(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "discount_percentage" TYPE numeric(5,2)`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "user_profit_discount_percentage" TYPE numeric(5,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "user_profit_discount_percentage" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "discount_percentage" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discount_amount"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "discount_percentage"`);
    }

}
