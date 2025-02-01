import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1730206214184 implements MigrationInterface {
    name = 'Store1730206214184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "product_code" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "product_code" SET NOT NULL`);
    }

}
