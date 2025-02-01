import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1728821564090 implements MigrationInterface {
    name = 'Store1728821564090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "note" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "note" SET NOT NULL`);
    }

}
