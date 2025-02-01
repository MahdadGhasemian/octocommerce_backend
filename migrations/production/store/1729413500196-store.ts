import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1729413500196 implements MigrationInterface {
    name = 'Store1729413500196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d44ea015fcfc25027b102d14d0"`);
        await queryRunner.query(`ALTER TABLE "external_seller" RENAME COLUMN "product_url" TO "store_product_url"`);
        await queryRunner.query(`CREATE TABLE "external_category_seller" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "store_name" character varying NOT NULL, "store_category_url" character varying NOT NULL, "store_category_english_name" character varying NOT NULL, "store_category_persian_name" character varying NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_7a084061e64fe27e7a29a35d6d2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aa6061f8419fc181b3eee5eb6e" ON "external_category_seller" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "sort_number"`);
        await queryRunner.query(`CREATE INDEX "IDX_eae0a7adac2f3f973cf9528b21" ON "external_seller" ("store_product_url") `);
        await queryRunner.query(`ALTER TABLE "external_category_seller" ADD CONSTRAINT "FK_aa6061f8419fc181b3eee5eb6e5" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_category_seller" DROP CONSTRAINT "FK_aa6061f8419fc181b3eee5eb6e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eae0a7adac2f3f973cf9528b21"`);
        await queryRunner.query(`ALTER TABLE "category" ADD "sort_number" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aa6061f8419fc181b3eee5eb6e"`);
        await queryRunner.query(`DROP TABLE "external_category_seller"`);
        await queryRunner.query(`ALTER TABLE "external_seller" RENAME COLUMN "store_product_url" TO "product_url"`);
        await queryRunner.query(`CREATE INDEX "IDX_d44ea015fcfc25027b102d14d0" ON "external_seller" ("product_url") `);
    }

}
