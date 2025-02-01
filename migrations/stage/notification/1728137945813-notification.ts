import { MigrationInterface, QueryRunner } from "typeorm";

export class Notification1728137945813 implements MigrationInterface {
    name = 'Notification1728137945813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying, "email" character varying, "first_name" character varying, "last_name" character varying, "avatar" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."message_type_enum" AS ENUM('default', 'new_order', 'new_payment', 'new_delivery', 'new_board', 'edit_board', 'new_review', 'new_question')`);
        await queryRunner.query(`CREATE TYPE "public"."message_group_type_enum" AS ENUM('default', 'board')`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "is_viewed" boolean NOT NULL DEFAULT false, "type" "public"."message_type_enum" NOT NULL DEFAULT 'default', "group_type" "public"."message_group_type_enum" NOT NULL DEFAULT 'default', "title" character varying, "body" character varying, "data" jsonb NOT NULL DEFAULT '{}', "user_id" integer NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_54ce30caeb3f33d68398ea1037" ON "message" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_54ce30caeb3f33d68398ea10376" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_54ce30caeb3f33d68398ea10376"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_54ce30caeb3f33d68398ea1037"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TYPE "public"."message_group_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."message_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
