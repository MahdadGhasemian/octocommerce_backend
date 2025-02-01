import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1733646951144 implements MigrationInterface {
    name = 'Auth1733646951144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "mobile_phone_is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "email_is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "created_by_system" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_by_system"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "email_is_verified"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mobile_phone_is_verified"`);
    }

}
