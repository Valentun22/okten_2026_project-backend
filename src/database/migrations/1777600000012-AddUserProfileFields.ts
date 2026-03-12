import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserProfileFields1777600000012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "birthdate"   DATE         NULL,
        ADD COLUMN IF NOT EXISTS "city"        TEXT         NULL,
        ADD COLUMN IF NOT EXISTS "gender"      TEXT         NULL,
        ADD COLUMN IF NOT EXISTS "instagram"   TEXT         NULL,
        ADD COLUMN IF NOT EXISTS "interests"   TEXT         NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "birthdate",
        DROP COLUMN IF EXISTS "city",
        DROP COLUMN IF EXISTS "gender",
        DROP COLUMN IF EXISTS "instagram",
        DROP COLUMN IF EXISTS "interests";
    `);
  }
}
