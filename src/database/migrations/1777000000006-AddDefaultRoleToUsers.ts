import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDefaultRoleToUsers1777000000006 implements MigrationInterface {
  name = 'AddDefaultRoleToUsers1777000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN role
      SET DEFAULT ARRAY['user']::users_role_enum[];
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ALTER COLUMN role
      DROP DEFAULT;
    `)
  }
}