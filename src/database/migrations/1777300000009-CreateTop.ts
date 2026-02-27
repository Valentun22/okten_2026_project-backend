import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTop1777300000009 implements MigrationInterface {
  name = 'CreateTop1777300000009';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "top_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),

        "title" text NOT NULL,
        "slug" text NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "order" integer NOT NULL DEFAULT 0,

        CONSTRAINT "PK_top_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_top_categories_slug" UNIQUE ("slug")
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_top_categories_slug" ON "top_categories" ("slug")`);
    await queryRunner.query(`CREATE INDEX "IDX_top_categories_order" ON "top_categories" ("order")`);

    await queryRunner.query(`
      CREATE TABLE "top_category_venues" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),

        "category_id" uuid NOT NULL,
        "venue_id" uuid NOT NULL,
        "order" integer NOT NULL DEFAULT 0,

        CONSTRAINT "PK_top_category_venues_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_top_category_venue" UNIQUE ("category_id", "venue_id"),
        CONSTRAINT "FK_top_category_venues_category" FOREIGN KEY ("category_id") REFERENCES "top_categories"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_top_category_venues_venue" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_top_category_venues_category_id" ON "top_category_venues" ("category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_top_category_venues_venue_id" ON "top_category_venues" ("venue_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_top_category_venues_order" ON "top_category_venues" ("order")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_top_category_venues_order"`);
    await queryRunner.query(`DROP INDEX "IDX_top_category_venues_venue_id"`);
    await queryRunner.query(`DROP INDEX "IDX_top_category_venues_category_id"`);
    await queryRunner.query(`DROP TABLE "top_category_venues"`);
    await queryRunner.query(`DROP INDEX "IDX_top_categories_order"`);
    await queryRunner.query(`DROP INDEX "IDX_top_categories_slug"`);
    await queryRunner.query(`DROP TABLE "top_categories"`);
  }
}
