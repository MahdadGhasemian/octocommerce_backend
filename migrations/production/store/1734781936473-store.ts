import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1734781936473 implements MigrationInterface {
    name = 'Store1734781936473'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "packaging_cost" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "cost" numeric(15,0) NOT NULL DEFAULT '0', "shared_packaging" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8ccab6e8df8c62b716959d94f9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD "is_online_payment_allowed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "packaging_cost_id" integer`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_e9e0f4cef32be5b3b7bec98a0a3" FOREIGN KEY ("packaging_cost_id") REFERENCES "packaging_cost"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_e9e0f4cef32be5b3b7bec98a0a3"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "packaging_cost_id"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "is_online_payment_allowed"`);
        await queryRunner.query(`DROP TABLE "packaging_cost"`);
    }

}
