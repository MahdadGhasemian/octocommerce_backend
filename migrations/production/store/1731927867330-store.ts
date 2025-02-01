import { MigrationInterface, QueryRunner } from "typeorm";

export class Store1731927867330 implements MigrationInterface {
    name = 'Store1731927867330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ADD "contact_id" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_33d4fc93803e7192e150216fff" ON "contact" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_04ec30f762773255afc023e652" ON "order" ("contact_id") `);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_33d4fc93803e7192e150216fffb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_04ec30f762773255afc023e6524" FOREIGN KEY ("contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_04ec30f762773255afc023e6524"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_33d4fc93803e7192e150216fffb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_04ec30f762773255afc023e652"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_33d4fc93803e7192e150216fff"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "contact_id"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "user_id"`);
    }

}
