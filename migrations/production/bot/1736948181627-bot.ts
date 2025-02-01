import { MigrationInterface, QueryRunner } from "typeorm";

export class Bot1736948181627 implements MigrationInterface {
    name = 'Bot1736948181627'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "need_to_set_name" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "need_to_set_name"`);
    }

}
