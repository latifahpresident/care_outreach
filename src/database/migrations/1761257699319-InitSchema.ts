import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1761257699319 implements MigrationInterface {
    name = 'InitSchema1761257699319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members" ("id" SERIAL NOT NULL, "email" text NOT NULL, "phone_number" text NOT NULL, "plan_id" integer NOT NULL, "created_ate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2714af51e3f7dd42cf66eeb08d6" UNIQUE ("email"), CONSTRAINT "UQ_6d0eda11081c30a41963bf4c2b1" UNIQUE ("phone_number"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinators" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e65f004c910bed9a3a82335d790" UNIQUE ("email"), CONSTRAINT "PK_4f4d48f1f19c8f06b0bbcf395ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coordinator_plans" ("id" SERIAL NOT NULL, "coordinator_id" integer NOT NULL, "plan_id" integer NOT NULL, CONSTRAINT "PK_0dc62d49820f8295adba4a4ab6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5eb2aa64ef6f126219a9d7749b" ON "coordinator_plans" ("coordinator_id", "plan_id") `);
        await queryRunner.query(`CREATE TABLE "plans" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_253d25dae4c94ee913bc5ec4850" UNIQUE ("name"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "members" ADD CONSTRAINT "FK_fcc54dde4a5390c90665481b1c8" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_plans" ADD CONSTRAINT "FK_0f0cff33866a028deb613ff065f" FOREIGN KEY ("coordinator_id") REFERENCES "coordinators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "coordinator_plans" ADD CONSTRAINT "FK_be6a1704e21683b35044685265d" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coordinator_plans" DROP CONSTRAINT "FK_be6a1704e21683b35044685265d"`);
        await queryRunner.query(`ALTER TABLE "coordinator_plans" DROP CONSTRAINT "FK_0f0cff33866a028deb613ff065f"`);
        await queryRunner.query(`ALTER TABLE "members" DROP CONSTRAINT "FK_fcc54dde4a5390c90665481b1c8"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5eb2aa64ef6f126219a9d7749b"`);
        await queryRunner.query(`DROP TABLE "coordinator_plans"`);
        await queryRunner.query(`DROP TABLE "coordinators"`);
        await queryRunner.query(`DROP TABLE "members"`);
    }

}
