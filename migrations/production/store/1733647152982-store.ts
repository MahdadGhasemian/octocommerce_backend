import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1733647152982 implements MigrationInterface {
    name = 'Store1733647152982'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."short_message_title_type_enum" AS ENUM('code_account_1', 'code_account_2', 'code_account_3', 'code_account_4', 'code_account_5', 'code_order_1', 'code_order_2', 'code_order_3', 'code_order_4', 'code_order_5', 'code_order_6', 'code_payment_1', 'code_payment_2', 'code_payment_3', 'code_payment_4', 'code_payment_5', 'code_payment_6', 'code_delivery_1', 'code_delivery_2', 'code_delivery_3', 'code_delivery_4', 'code_delivery_5', 'code_promotion_1', 'code_promotion_2', 'code_support_1', 'code_support_2', 'code_support_3', 'code_internal_1', 'code_internal_2', 'code_internal_3')`);
        await queryRunner.query(`CREATE TABLE "short_message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying NOT NULL, "title_type" "public"."short_message_title_type_enum" NOT NULL, "text_list" jsonb, "is_sent_by_system" boolean NOT NULL, "user_id" integer, CONSTRAINT "PK_359f8a2fc0daf370939d5dd26a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9a4c0eb4b475bc9dbc8757e123" ON "short_message" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "user" ADD "mobile_phone_is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'unknown', 'both')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'unknown'`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_by_system" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "short_message" ADD CONSTRAINT "FK_9a4c0eb4b475bc9dbc8757e1230" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "short_message" DROP CONSTRAINT "FK_9a4c0eb4b475bc9dbc8757e1230"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_by_system"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "gender"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_is_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobile_phone_is_verified"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a4c0eb4b475bc9dbc8757e123"`);
        await queryRunner.query(`DROP TABLE "short_message"`);
        await queryRunner.query(`DROP TYPE "public"."short_message_title_type_enum"`);
    }

}
