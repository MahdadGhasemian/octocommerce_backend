import { MigrationInterface, QueryRunner } from "typeorm";

export class Auth1736948101382 implements MigrationInterface {
    name = 'Auth1736948101382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "need_to_set_name" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "need_to_set_name"`);
    }

}
