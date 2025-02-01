import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1731914425418 implements MigrationInterface {
    name = 'Store1731914425418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "packaging_cost" numeric(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shipping_cost" numeric(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "is_confirmed_rejected_by_system" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "packaging_cost_default" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "shipping_cost_default" numeric NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "shipping_cost_default"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "packaging_cost_default"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "is_confirmed_rejected_by_system"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shipping_cost"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "packaging_cost"`);
    }

}
