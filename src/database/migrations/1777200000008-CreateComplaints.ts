import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateComplaints1777200000008 implements MigrationInterface {
  name = 'CreateComplaints1777200000008';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "complaints_type_enum" AS ENUM ('venue', 'news', 'comment', 'other')`);
    await queryRunner.query(
      `CREATE TYPE "complaints_status_enum" AS ENUM ('new', 'in_review', 'resolved', 'rejected')`,
    );

    await queryRunner.query(`
      CREATE TABLE "complaints" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),

        "venue_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "type" "complaints_type_enum" NOT NULL DEFAULT 'venue',
        "targetId" text,
        "reason" text NOT NULL,
        "status" "complaints_status_enum" NOT NULL DEFAULT 'new',

        CONSTRAINT "PK_complaints_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_complaints_venue" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_complaints_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_complaints_venue_id" ON "complaints" ("venue_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_complaints_user_id" ON "complaints" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_complaints_status" ON "complaints" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_complaints_type" ON "complaints" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_complaints_created" ON "complaints" ("created")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_complaints_created"`);
    await queryRunner.query(`DROP INDEX "IDX_complaints_type"`);
    await queryRunner.query(`DROP INDEX "IDX_complaints_status"`);
    await queryRunner.query(`DROP INDEX "IDX_complaints_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_complaints_venue_id"`);
    await queryRunner.query(`DROP TABLE "complaints"`);
    await queryRunner.query(`DROP TYPE "complaints_status_enum"`);
    await queryRunner.query(`DROP TYPE "complaints_type_enum"`);
  }
}
