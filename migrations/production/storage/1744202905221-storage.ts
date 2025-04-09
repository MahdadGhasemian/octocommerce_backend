import { MigrationInterface, QueryRunner } from "typeorm";

export class Storage1744202905221 implements MigrationInterface {
    name = 'Storage1744202905221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "private_file" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "object_name" character varying, "bucket_name" character varying, "url" character varying, "description" character varying, "user_id" integer NOT NULL, CONSTRAINT "PK_6ef35c8eae2d9df2959ef4227de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_gender_enum" AS ENUM('male', 'female', 'unknown', 'both')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying, "mobile_phone_is_verified" boolean NOT NULL DEFAULT false, "email" character varying, "email_is_verified" boolean NOT NULL DEFAULT false, "first_name" character varying, "last_name" character varying, "avatar" character varying, "gender" "public"."user_gender_enum" NOT NULL DEFAULT 'unknown', "created_by_system" boolean NOT NULL DEFAULT false, "need_to_set_name" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
        await queryRunner.query(`DROP TABLE "private_file"`);
    }

}
