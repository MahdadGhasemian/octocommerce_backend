import { MigrationInterface, QueryRunner } from "typeorm";

export class Bot1744202898888 implements MigrationInterface {
    name = 'Bot1744202898888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scrape" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "session_id" character varying NOT NULL, "total_items" integer, "items_per_page" integer, "page_number" integer, "total_pages" integer, "product_id" integer, "store_name" character varying, "store_product_url" character varying, "store_product_id" character varying, "available_quantity" integer, "sale_price" integer, "error_message" character varying, CONSTRAINT "PK_1428a194a4207c1631898dd0d80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "telegram" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2db8c5fd44d5a77259aadc814b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'unknown', 'both')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying, "mobile_phone_is_verified" boolean NOT NULL DEFAULT false, "email" character varying, "email_is_verified" boolean NOT NULL DEFAULT false, "first_name" character varying, "last_name" character varying, "avatar" character varying, "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'unknown', "created_by_system" boolean NOT NULL DEFAULT false, "need_to_set_name" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "telegram"`);
        await queryRunner.query(`DROP TABLE "scrape"`);
    }

}
