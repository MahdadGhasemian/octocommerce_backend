import { MigrationInterface, QueryRunner } from "typeorm";

export class Bot1736772985046 implements MigrationInterface {
    name = 'Bot1736772985046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scrape" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "session_id" character varying NOT NULL, "total_items" integer, "items_per_page" integer, "page_number" integer, "total_pages" integer, "product_id" integer, "store_name" character varying, "store_product_url" character varying, "store_product_id" character varying, "available_quantity" integer, "sale_price" integer, "error_message" character varying, CONSTRAINT "PK_1428a194a4207c1631898dd0d80" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scrape"`);
    }

}
