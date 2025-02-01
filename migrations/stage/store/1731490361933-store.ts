import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1731490361933 implements MigrationInterface {
    name = 'Store1731490361933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "price_scale_value" numeric(15,6) NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "product" ADD "is_scalable_price" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "base_price_scale_amount" numeric(15,0) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "base_price_scale_amount"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "is_scalable_price"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "price_scale_value"`);
    }

}
