import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1736948196655 implements MigrationInterface {
    name = 'Store1736948196655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "postal_code"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_city" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_postal_code" character varying`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "user" ADD "need_to_set_name" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "need_to_set_name"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_longitude"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_latitude"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_postal_code"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_city"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "postal_code" character varying`);
    }

}
