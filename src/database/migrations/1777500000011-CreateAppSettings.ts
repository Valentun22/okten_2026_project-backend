import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppSettings1777500000011 implements MigrationInterface {
  name = 'CreateAppSettings1777500000011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "app_settings" (
        "key"       text NOT NULL,
        "value"     text,
        "updatedAt" text,
        CONSTRAINT "PK_app_settings_key" PRIMARY KEY ("key")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "app_settings" ("key", "value") VALUES
        ('about_title', 'Про нас'),
        ('about_text', 'Пиячок — це сучасний сервіс для пошуку закладів, перегляду відгуків та планування зустрічей.'),
        ('contact_phone', '+380 XX XXX XX XX'),
        ('contact_email', 'info@pyachok.com'),
        ('contact_address', 'Україна')
      ON CONFLICT ("key") DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "app_settings"`);
  }
}