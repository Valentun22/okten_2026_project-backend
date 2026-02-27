import { MigrationInterface, QueryRunner } from 'typeorm';
import { TableNameEnum } from '../entities/enums/table-name.enum';

export class AddRatingToRatingVenue1776700000003 implements MigrationInterface {
  name = 'AddRatingToRatingVenue1776700000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${TableNameEnum.RATING_VENUE}"
            ADD COLUMN IF NOT EXISTS "rating" int NOT NULL DEFAULT 10
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'CHK_rating_1_10'
        ) THEN
          ALTER TABLE "${TableNameEnum.RATING_VENUE}"
          ADD CONSTRAINT "CHK_rating_1_10" CHECK ("rating" >= 1 AND "rating" <= 10);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "${TableNameEnum.RATING_VENUE}" DROP CONSTRAINT IF EXISTS "CHK_rating_1_10"
    `);

    await queryRunner.query(`
        ALTER TABLE "${TableNameEnum.RATING_VENUE}" DROP COLUMN IF EXISTS "rating"
    `);
  }
}