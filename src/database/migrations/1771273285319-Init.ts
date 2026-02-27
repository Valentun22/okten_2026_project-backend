import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771273285319 implements MigrationInterface {
    name = 'Init1771273285319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "likes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "venue_id" uuid NOT NULL, CONSTRAINT "UQ_e77fd1f91660d3e0ce133f7b18b" UNIQUE ("user_id", "venue_id"), CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."news_type_enum" AS ENUM('general', 'promotion', 'event')`);
        await queryRunner.query(`CREATE TABLE "news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "body" text NOT NULL, "title" text NOT NULL, "type" "public"."news_type_enum" NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "avatarNews" text, "images" text array, "venue_id" uuid NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rating_venue" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "venue_id" uuid NOT NULL, CONSTRAINT "UQ_d2eae74ce3baf141d72938ea8a6" UNIQUE ("user_id", "venue_id"), CONSTRAINT "PK_6c6d3946a0bca30b19589f9d63d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."venues_categories_enum" AS ENUM('restaurant', 'bar', 'cafe', 'pub', 'club', 'fast_food', 'pizzeria', 'sushi', 'brewery', 'lounge', 'steakhouse', 'bakery', 'coffee_shop', 'wine_bar', 'food_court', 'street_food', 'karaoke', 'hookah')`);
        await queryRunner.query(`CREATE TABLE "venues" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "avatarVenue" text, "logoVenue" text, "image" text array, "menu" text, "averageCheck" double precision, "workingHours" jsonb, "city" text NOT NULL, "address" text NOT NULL, "categories" "public"."venues_categories_enum" array, "isModerated" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "phone" text, "email" text, "website" text, "socials" jsonb, "description" text NOT NULL, "hasWiFi" boolean NOT NULL DEFAULT false, "petFriendly" boolean NOT NULL DEFAULT false, "hasTerrace" boolean NOT NULL DEFAULT false, "smokingAllowed" boolean NOT NULL DEFAULT false, "cardPayment" boolean NOT NULL DEFAULT false, "location" geography(Point,4326) NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_cb0f885278d12384eb7a81818be" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_be677afd59218cba25e6e38789" ON "venues" USING GiST ("location") `);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "body" text NOT NULL, "title" text NOT NULL, "image_check" text, "rating" integer NOT NULL, "user_id" uuid NOT NULL, "venue_id" uuid NOT NULL, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "follows" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "follower_id" uuid NOT NULL, "following_id" uuid NOT NULL, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9769b295a8d670435ce210ba15" ON "refresh_tokens" ("deviceId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'superadmin', 'venue_admin', 'critic')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "bio" text, "image" text, "role" "public"."users_role_enum" array NOT NULL DEFAULT ARRAY['user']::users_role_enum[], CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);        await queryRunner.query(`CREATE TABLE "venues_tags_tags" ("venuesId" uuid NOT NULL, "tagsId" uuid NOT NULL, CONSTRAINT "PK_9e932bf228e400602f2f8e2986b" PRIMARY KEY ("venuesId", "tagsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22126bcbbe1b761dc4014f2192" ON "venues_tags_tags" ("venuesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0f5a4f16f7dc44727e0d88a403" ON "venues_tags_tags" ("tagsId") `);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "likes" ADD CONSTRAINT "FK_498fb2b5e55ca0e1758df70c751" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "news" ADD CONSTRAINT "FK_188e98dc075e9139290bd266fb0" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_venue" ADD CONSTRAINT "FK_d0e6464445a29fe4c5f971492fb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "rating_venue" ADD CONSTRAINT "FK_d6a15fe6d634a1c64f6e92f1097" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_a094359edfcc78b9a69573a3b96" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_eb5d88250413d235fa6c590d3c7" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_54b5dc2739f2dea57900933db66" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follows" ADD CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "venues_tags_tags" ADD CONSTRAINT "FK_22126bcbbe1b761dc4014f21920" FOREIGN KEY ("venuesId") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "venues_tags_tags" ADD CONSTRAINT "FK_0f5a4f16f7dc44727e0d88a4033" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "venues_tags_tags" DROP CONSTRAINT "FK_0f5a4f16f7dc44727e0d88a4033"`);
        await queryRunner.query(`ALTER TABLE "venues_tags_tags" DROP CONSTRAINT "FK_22126bcbbe1b761dc4014f21920"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_c518e3988b9c057920afaf2d8c0"`);
        await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "FK_54b5dc2739f2dea57900933db66"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_eb5d88250413d235fa6c590d3c7"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d"`);
        await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_a094359edfcc78b9a69573a3b96"`);
        await queryRunner.query(`ALTER TABLE "rating_venue" DROP CONSTRAINT "FK_d6a15fe6d634a1c64f6e92f1097"`);
        await queryRunner.query(`ALTER TABLE "rating_venue" DROP CONSTRAINT "FK_d0e6464445a29fe4c5f971492fb"`);
        await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_188e98dc075e9139290bd266fb0"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_498fb2b5e55ca0e1758df70c751"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP CONSTRAINT "FK_3f519ed95f775c781a254089171"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0f5a4f16f7dc44727e0d88a403"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22126bcbbe1b761dc4014f2192"`);
        await queryRunner.query(`DROP TABLE "venues_tags_tags"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9769b295a8d670435ce210ba15"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "follows"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be677afd59218cba25e6e38789"`);
        await queryRunner.query(`DROP TABLE "venues"`);
        await queryRunner.query(`DROP TYPE "public"."venues_categories_enum"`);
        await queryRunner.query(`DROP TABLE "tags"`);
        await queryRunner.query(`DROP TABLE "rating_venue"`);
        await queryRunner.query(`DROP TABLE "news"`);
        await queryRunner.query(`DROP TYPE "public"."news_type_enum"`);
        await queryRunner.query(`DROP TABLE "likes"`);
    }

}
