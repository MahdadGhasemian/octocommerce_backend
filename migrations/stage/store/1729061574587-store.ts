import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1729061574587 implements MigrationInterface {
    name = 'Store1729061574587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "datasheet" character varying`);
        await queryRunner.query(`ALTER TABLE "product" ADD "part_number" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."product_product_type_enum" AS ENUM('unknown', 'original', 'copy', 'renew')`);
        await queryRunner.query(`ALTER TABLE "product" ADD "product_type" "public"."product_product_type_enum" NOT NULL DEFAULT 'unknown'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "product_type"`);
        await queryRunner.query(`DROP TYPE "public"."product_product_type_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "part_number"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "datasheet"`);
    }

}
