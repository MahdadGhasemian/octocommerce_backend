import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1728719943309 implements MigrationInterface {
    name = 'Store1728719943309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "external_seller" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "store_name" character varying NOT NULL, "product_url" character varying NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_72dfe2a08dd0de595dee5471005" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_37d4681a8df569c3aa1e360ca0" ON "external_seller" ("store_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d44ea015fcfc25027b102d14d0" ON "external_seller" ("product_url") `);
        await queryRunner.query(`CREATE INDEX "IDX_4fc98ab53f438ddf2d40785c81" ON "external_seller" ("product_id") `);
        await queryRunner.query(`ALTER TABLE "external_seller" ADD CONSTRAINT "FK_4fc98ab53f438ddf2d40785c81a" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_seller" DROP CONSTRAINT "FK_4fc98ab53f438ddf2d40785c81a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4fc98ab53f438ddf2d40785c81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d44ea015fcfc25027b102d14d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_37d4681a8df569c3aa1e360ca0"`);
        await queryRunner.query(`DROP TABLE "external_seller"`);
    }

}
