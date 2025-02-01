import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1736474079611 implements MigrationInterface {
    name = 'Store1736474079611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_method_delivery_type_enum" AS ENUM('post_normal', 'post_fast', 'tipax', 'rider', 'self_pickup')`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_method_delivery_charge_type_enum" AS ENUM('prepaid', 'cod')`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_method_delivery_pricing_type_enum" AS ENUM('fixed', 'selected_area', 'per_kilometer')`);
        await queryRunner.query(`CREATE TABLE "delivery_method" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "delivery_type" "public"."delivery_method_delivery_type_enum" NOT NULL DEFAULT 'post_normal', "delivery_charge_type" "public"."delivery_method_delivery_charge_type_enum" NOT NULL DEFAULT 'prepaid', "delivery_pricing_type" "public"."delivery_method_delivery_pricing_type_enum" NOT NULL DEFAULT 'fixed', "fixed_price" numeric(15,0) DEFAULT '0', "per_kilometer" numeric(15,0) DEFAULT '0', "delivery_method_area_rules" jsonb NOT NULL DEFAULT '[]', "is_enabled" boolean NOT NULL DEFAULT false, "description" character varying, CONSTRAINT "PK_8bad1c538ff561c66e1db629c5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_ec67a0143b254c3577087b20d3"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shipping_cost"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "packaging_cost_default"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "shipping_cost_default"`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_method_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ADD "delivery_method_area_rule_area_name" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."contact_contact_type_enum" AS ENUM('individual', 'enterprise')`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "contact_type" "public"."contact_contact_type_enum" NOT NULL DEFAULT 'individual'`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "order" ADD "delivery_cost" numeric(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "contact_snapshot" jsonb`);
        await queryRunner.query(`ALTER TABLE "order" ADD "billing_contact_id" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "billing_contact_snapshot" jsonb`);
        await queryRunner.query(`ALTER TABLE "order" ADD "delivery_id" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "UQ_962eec87d3d029c51525f259fba" UNIQUE ("delivery_id")`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "delivery_center_latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "delivery_center_longitude" double precision`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_delivery_type_enum" RENAME TO "delivery_delivery_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_delivery_type_enum" AS ENUM('post_normal', 'post_fast', 'tipax', 'rider', 'self_pickup')`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" TYPE "public"."delivery_delivery_type_enum" USING "delivery_type"::"text"::"public"."delivery_delivery_type_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" SET DEFAULT 'post_normal'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_delivery_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_national_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_mobile_phone_number" DROP NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_c1e327ff0d4c0ee80c8d3aaba5" ON "delivery" ("delivery_method_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c579c17491158a75f1a9fbdc0" ON "order" ("billing_contact_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_962eec87d3d029c51525f259fb" ON "order" ("delivery_id") `);
        await queryRunner.query(`ALTER TABLE "delivery" ADD CONSTRAINT "FK_c1e327ff0d4c0ee80c8d3aaba51" FOREIGN KEY ("delivery_method_id") REFERENCES "delivery_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_9c579c17491158a75f1a9fbdc05" FOREIGN KEY ("billing_contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_962eec87d3d029c51525f259fba" FOREIGN KEY ("delivery_id") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_962eec87d3d029c51525f259fba"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_9c579c17491158a75f1a9fbdc05"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP CONSTRAINT "FK_c1e327ff0d4c0ee80c8d3aaba51"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_962eec87d3d029c51525f259fb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c579c17491158a75f1a9fbdc0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1e327ff0d4c0ee80c8d3aaba5"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_mobile_phone_number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_national_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "recipient_name" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."delivery_delivery_type_enum_old" AS ENUM('delivery', 'self_pickup')`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" TYPE "public"."delivery_delivery_type_enum_old" USING "delivery_type"::"text"::"public"."delivery_delivery_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "delivery" ALTER COLUMN "delivery_type" SET DEFAULT 'delivery'`);
        await queryRunner.query(`DROP TYPE "public"."delivery_delivery_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."delivery_delivery_type_enum_old" RENAME TO "delivery_delivery_type_enum"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "delivery_center_longitude"`);
        await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "delivery_center_latitude"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "UQ_962eec87d3d029c51525f259fba"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "delivery_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "billing_contact_snapshot"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "billing_contact_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "contact_snapshot"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "delivery_cost"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "contact_type"`);
        await queryRunner.query(`DROP TYPE "public"."contact_contact_type_enum"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_method_area_rule_area_name"`);
        await queryRunner.query(`ALTER TABLE "delivery" DROP COLUMN "delivery_method_id"`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "shipping_cost_default" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "setting" ADD "packaging_cost_default" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "shipping_cost" numeric(15,0) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveryId" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_ec67a0143b254c3577087b20d3" UNIQUE ("deliveryId")`);
        await queryRunner.query(`DROP TABLE "delivery_method"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_method_delivery_pricing_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_method_delivery_charge_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."delivery_method_delivery_type_enum"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
