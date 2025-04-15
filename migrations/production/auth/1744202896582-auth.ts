import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1744202896582 implements MigrationInterface {
    name = 'Auth1744202896582'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "endpoint" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "tag" character varying NOT NULL, "path" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "PK_7785c5c2cf24e6ab3abb7a2e89f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "image" character varying, "color" character varying, "cannot_be_deleted" boolean NOT NULL DEFAULT false, "has_full_access" boolean NOT NULL DEFAULT false, "is_internal_user" boolean NOT NULL DEFAULT false, "notification_order_created" boolean NOT NULL DEFAULT false, "notification_payment_created" boolean NOT NULL DEFAULT false, "notification_delivery_created" boolean NOT NULL DEFAULT false, "info_endpoints" jsonb, CONSTRAINT "PK_e386259e6046c45ab06811584ed" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c0dde697a4184a1369159102cc" ON "access" ("info_endpoints") `);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'unknown', 'both')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying NOT NULL, "mobile_phone_is_verified" boolean NOT NULL DEFAULT false, "email" character varying, "email_is_verified" boolean NOT NULL DEFAULT false, "first_name" character varying, "last_name" character varying, "avatar" character varying, "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'unknown', "hashed_password" character varying NOT NULL, "created_by_system" boolean NOT NULL DEFAULT false, "need_to_set_name" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_81640cabe754993749b74480468" UNIQUE ("mobile_phone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "access_endpoints_endpoint" ("accessId" integer NOT NULL, "endpointId" integer NOT NULL, CONSTRAINT "PK_75796db4fb099937e686b71432f" PRIMARY KEY ("accessId", "endpointId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cc58302148b06adab01b8ac62b" ON "access_endpoints_endpoint" ("accessId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b99954274131944840c08a95fa" ON "access_endpoints_endpoint" ("endpointId") `);
        await queryRunner.query(`CREATE TABLE "user_accesses_access" ("userId" integer NOT NULL, "accessId" integer NOT NULL, CONSTRAINT "PK_c4efa7a403bc528f7a67903d555" PRIMARY KEY ("userId", "accessId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cad89ffd92c0e424f53d5f455a" ON "user_accesses_access" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e73445e27ba4a120d52cc6a8a" ON "user_accesses_access" ("accessId") `);
        await queryRunner.query(`ALTER TABLE "access_endpoints_endpoint" ADD CONSTRAINT "FK_cc58302148b06adab01b8ac62bc" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "access_endpoints_endpoint" ADD CONSTRAINT "FK_b99954274131944840c08a95fab" FOREIGN KEY ("endpointId") REFERENCES "endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_accesses_access" ADD CONSTRAINT "FK_cad89ffd92c0e424f53d5f455a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_accesses_access" ADD CONSTRAINT "FK_2e73445e27ba4a120d52cc6a8a4" FOREIGN KEY ("accessId") REFERENCES "access"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accesses_access" DROP CONSTRAINT "FK_2e73445e27ba4a120d52cc6a8a4"`);
        await queryRunner.query(`ALTER TABLE "user_accesses_access" DROP CONSTRAINT "FK_cad89ffd92c0e424f53d5f455a2"`);
        await queryRunner.query(`ALTER TABLE "access_endpoints_endpoint" DROP CONSTRAINT "FK_b99954274131944840c08a95fab"`);
        await queryRunner.query(`ALTER TABLE "access_endpoints_endpoint" DROP CONSTRAINT "FK_cc58302148b06adab01b8ac62bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e73445e27ba4a120d52cc6a8a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cad89ffd92c0e424f53d5f455a"`);
        await queryRunner.query(`DROP TABLE "user_accesses_access"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b99954274131944840c08a95fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc58302148b06adab01b8ac62b"`);
        await queryRunner.query(`DROP TABLE "access_endpoints_endpoint"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0dde697a4184a1369159102cc"`);
        await queryRunner.query(`DROP TABLE "access"`);
        await queryRunner.query(`DROP TABLE "endpoint"`);
    }

}
