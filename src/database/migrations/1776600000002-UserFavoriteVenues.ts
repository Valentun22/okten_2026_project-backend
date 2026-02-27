import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFavoriteVenues1776600000002 implements MigrationInterface {
  name = 'UserFavoriteVenues1776600000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user_favorite_venues" (
                                                              "user_id" uuid NOT NULL,
                                                              "venue_id" uuid NOT NULL,
                                                              CONSTRAINT "PK_user_favorite_venues" PRIMARY KEY ("user_id", "venue_id"),
            CONSTRAINT "FK_fav_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_fav_venue" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE CASCADE
            )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fav_user_id" ON "user_favorite_venues" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_fav_venue_id" ON "user_favorite_venues" ("venue_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_favorite_venues"`);
  }
}