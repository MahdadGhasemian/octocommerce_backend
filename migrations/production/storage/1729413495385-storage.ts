import { MigrationInterface, QueryRunner } from "typeorm";

export class Storage1729413495385 implements MigrationInterface {
    name = 'Storage1729413495385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_file" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "private_file" ADD "object_name" character varying`);
        await queryRunner.query(`ALTER TABLE "private_file" ADD "bucket_name" character varying`);
        await queryRunner.query(`ALTER TABLE "private_file" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "private_file" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "private_file" DROP COLUMN "bucket_name"`);
        await queryRunner.query(`ALTER TABLE "private_file" DROP COLUMN "object_name"`);
        await queryRunner.query(`ALTER TABLE "private_file" ADD "file_name" character varying NOT NULL`);
    }

}
