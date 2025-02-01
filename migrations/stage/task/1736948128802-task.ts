import { MigrationInterface, QueryRunner } from "typeorm";

export class Task1736948128802 implements MigrationInterface {
    name = 'Task1736948128802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "need_to_set_name" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "need_to_set_name"`);
    }

}
