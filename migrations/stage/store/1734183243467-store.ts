import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1734183243467 implements MigrationInterface {
    name = 'Store1734183243467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "keywords" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "keywords"`);
    }

}
