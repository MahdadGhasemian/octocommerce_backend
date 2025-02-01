import { MigrationInterface, QueryRunner } from "typeorm";

export class Task1728293817403 implements MigrationInterface {
    name = 'Task1728293817403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" character varying, "owner_user_id" integer NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0e37e4919a3a1b2225bd795c49" ON "project" ("owner_user_id") `);
        await queryRunner.query(`CREATE TABLE "label" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" character varying, "background_color" character varying, CONSTRAINT "PK_5692ac5348861d3776eb5843672" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."content_content_type_enum" AS ENUM('user_comment', 'new_group', 'change_user_assign', 'change_general_data')`);
        await queryRunner.query(`CREATE TABLE "content" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "content_type" "public"."content_content_type_enum" NOT NULL DEFAULT 'user_comment', "content" character varying, "content_follow" character varying, "group_id" integer, "user_id" integer, CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b459ae1ffef2a947ebe7f06f0b" ON "content" ("group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_23b0aa9f011580a4737f3a96d6" ON "content" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "group" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "title" character varying NOT NULL, "description" character varying, "sequence_number" SERIAL NOT NULL, "label_id" integer NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c91d3d86531b5b324b9ec517b9" ON "group" ("label_id") `);
        await queryRunner.query(`CREATE TYPE "public"."board_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "priority" "public"."board_priority_enum" NOT NULL DEFAULT 'low', "title" character varying NOT NULL, "description" character varying, "board_sequence_number" integer NOT NULL DEFAULT '0', "project_id" integer, "group_id" integer, "created_by_user_id" integer NOT NULL, "assigned_to_user_id" integer, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_82669bdc9b6ff6943d29de9849" ON "board" ("project_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_595805c717d56b823f4d52eb13" ON "board" ("group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ccfdfe83f1e62fa669b850579b" ON "board" ("created_by_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0cce93a061ff97d879b8b0274" ON "board" ("assigned_to_user_id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "mobile_phone" character varying, "email" character varying, "first_name" character varying, "last_name" character varying, "avatar" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."comment_comment_type_enum" AS ENUM('activity', 'comment')`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "comment_type" "public"."comment_comment_type_enum" NOT NULL DEFAULT 'comment', "created_by_user_id" integer, "board_id" integer NOT NULL, "contentId" integer, CONSTRAINT "REL_644aaa64de01d4103d4d985129" UNIQUE ("contentId"), CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea45581d323bec5df3405af165" ON "comment" ("created_by_user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_77a3101cc141a4046264ce59d6" ON "comment" ("board_id") `);
        await queryRunner.query(`CREATE TABLE "project_users_user" ("projectId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_198c78e84c3bcdb0dc182e6d1e0" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9666c6dcd769c698bed4aa4bf5" ON "project_users_user" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f8300efd87679e1e21532be980" ON "project_users_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "board_flow_users_user" ("boardId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_e7c0faa31363022f43ba61293fd" PRIMARY KEY ("boardId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ef05bff1187c18275f079c6089" ON "board_flow_users_user" ("boardId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdf268b7a84ce5cab1fc3a4a07" ON "board_flow_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_0e37e4919a3a1b2225bd795c497" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_b459ae1ffef2a947ebe7f06f0bf" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_23b0aa9f011580a4737f3a96d6d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_c91d3d86531b5b324b9ec517b95" FOREIGN KEY ("label_id") REFERENCES "label"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_82669bdc9b6ff6943d29de98499" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_595805c717d56b823f4d52eb131" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_ccfdfe83f1e62fa669b850579b7" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_c0cce93a061ff97d879b8b0274a" FOREIGN KEY ("assigned_to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_644aaa64de01d4103d4d985129b" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_ea45581d323bec5df3405af1650" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_77a3101cc141a4046264ce59d6d" FOREIGN KEY ("board_id") REFERENCES "board"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users_user" ADD CONSTRAINT "FK_9666c6dcd769c698bed4aa4bf55" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_users_user" ADD CONSTRAINT "FK_f8300efd87679e1e21532be9808" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "board_flow_users_user" ADD CONSTRAINT "FK_ef05bff1187c18275f079c6089e" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "board_flow_users_user" ADD CONSTRAINT "FK_fdf268b7a84ce5cab1fc3a4a079" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_flow_users_user" DROP CONSTRAINT "FK_fdf268b7a84ce5cab1fc3a4a079"`);
        await queryRunner.query(`ALTER TABLE "board_flow_users_user" DROP CONSTRAINT "FK_ef05bff1187c18275f079c6089e"`);
        await queryRunner.query(`ALTER TABLE "project_users_user" DROP CONSTRAINT "FK_f8300efd87679e1e21532be9808"`);
        await queryRunner.query(`ALTER TABLE "project_users_user" DROP CONSTRAINT "FK_9666c6dcd769c698bed4aa4bf55"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_77a3101cc141a4046264ce59d6d"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_ea45581d323bec5df3405af1650"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_644aaa64de01d4103d4d985129b"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_c0cce93a061ff97d879b8b0274a"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_ccfdfe83f1e62fa669b850579b7"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_595805c717d56b823f4d52eb131"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_82669bdc9b6ff6943d29de98499"`);
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_c91d3d86531b5b324b9ec517b95"`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_23b0aa9f011580a4737f3a96d6d"`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_b459ae1ffef2a947ebe7f06f0bf"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_0e37e4919a3a1b2225bd795c497"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdf268b7a84ce5cab1fc3a4a07"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef05bff1187c18275f079c6089"`);
        await queryRunner.query(`DROP TABLE "board_flow_users_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f8300efd87679e1e21532be980"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9666c6dcd769c698bed4aa4bf5"`);
        await queryRunner.query(`DROP TABLE "project_users_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77a3101cc141a4046264ce59d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea45581d323bec5df3405af165"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TYPE "public"."comment_comment_type_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c0cce93a061ff97d879b8b0274"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ccfdfe83f1e62fa669b850579b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_595805c717d56b823f4d52eb13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82669bdc9b6ff6943d29de9849"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TYPE "public"."board_priority_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c91d3d86531b5b324b9ec517b9"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_23b0aa9f011580a4737f3a96d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b459ae1ffef2a947ebe7f06f0b"`);
        await queryRunner.query(`DROP TABLE "content"`);
        await queryRunner.query(`DROP TYPE "public"."content_content_type_enum"`);
        await queryRunner.query(`DROP TABLE "label"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0e37e4919a3a1b2225bd795c49"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
