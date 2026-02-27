import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableNameEnum } from '../entities/enums/table-name.enum';

export class CreateVenueViews1776900000005 implements MigrationInterface {
  name = 'CreateVenueViews1776900000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "${TableNameEnum.VENUE_VIEWS}" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created" TIMESTAMP NOT NULL DEFAULT now(),
        "updated" TIMESTAMP NOT NULL DEFAULT now(),

        "venue_id" uuid NOT NULL,
        "user_id" uuid NULL,
        "ip" text NULL,
        "userAgent" text NULL,

        CONSTRAINT "PK_venue_views_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_venue_views_venue" FOREIGN KEY ("venue_id")
          REFERENCES "${TableNameEnum.VENUES}"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_venue_views_user" FOREIGN KEY ("user_id")
          REFERENCES "${TableNameEnum.USERS}"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_venue_views_venue_created"
      ON "${TableNameEnum.VENUE_VIEWS}" ("venue_id", "created")
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_venue_views_user_created"
      ON "${TableNameEnum.VENUE_VIEWS}" ("user_id", "created")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "${TableNameEnum.VENUE_VIEWS}"`);
  }
}