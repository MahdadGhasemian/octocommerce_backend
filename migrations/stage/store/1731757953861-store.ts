import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1731757953861 implements MigrationInterface {
    name = 'Store1731757953861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_order_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "UQ_3d4f2c0ac1d61c47428a9dffc40" UNIQUE ("payment_order_id")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "payment_provider_data" jsonb`);
        await queryRunner.query(`ALTER TYPE "public"."payment_payment_type_enum" RENAME TO "payment_payment_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_payment_type_enum" AS ENUM('receipt', 'debit', 'online')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" TYPE "public"."payment_payment_type_enum" USING "payment_type"::"text"::"public"."payment_payment_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" SET DEFAULT 'receipt'`);
        await queryRunner.query(`DROP TYPE "public"."payment_payment_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_payment_type_enum_old" AS ENUM('receipt', 'debit')`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" TYPE "public"."payment_payment_type_enum_old" USING "payment_type"::"text"::"public"."payment_payment_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "payment" ALTER COLUMN "payment_type" SET DEFAULT 'receipt'`);
        await queryRunner.query(`DROP TYPE "public"."payment_payment_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_payment_type_enum_old" RENAME TO "payment_payment_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_provider_data"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "UQ_3d4f2c0ac1d61c47428a9dffc40"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "payment_order_id"`);
    }

}
