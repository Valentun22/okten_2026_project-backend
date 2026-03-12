import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuthFieldsToUsers1777400000010 implements MigrationInterface {
  name = 'AddOAuthFieldsToUsers1777400000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."users_oauthprovider_enum" AS ENUM (
        'google', 'facebook', 'google-play', 'app-store'
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "oauthProvider" "public"."users_oauthprovider_enum" NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "oauthId" text NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "password" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauthId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauthProvider"`);
    await queryRunner.query(`DROP TYPE "public"."users_oauthprovider_enum"`);
  }
}