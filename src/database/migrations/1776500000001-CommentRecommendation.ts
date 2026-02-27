import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentRecommendation1776500000001 implements MigrationInterface {
  name = 'CommentRecommendation1776500000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."comments_recommendation_enum" AS ENUM('recommend','not_recommend')`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD "recommendation" "public"."comments_recommendation_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "recommendation"`);
    await queryRunner.query(`DROP TYPE "public"."comments_recommendation_enum"`);
  }
}