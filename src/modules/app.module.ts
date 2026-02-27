import * as path from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { GlobalExceptionFilter } from '../common/http/global-exception.filter';
import configuration from '../config/configuration';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import { EmailModule } from './email/email.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { LoggerModule } from './logger/logger.module';
import { NewsModule } from './news/news.module';
import { PostgresModule } from './postgres/postgres.module';
import { PyachokModule } from './pyachok/pyachok.module';
import { RedisModule } from './redis/redis.module';
import { RepositoryModule } from './repository/repository.module';
import { TagModule } from './tag/tag.module';
import { TopModule } from './top/top.module';
import { UsersModule } from './users/users.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: path.resolve(process.cwd(), 'environments', 'local.env'),
    }),
    PostgresModule,
    RedisModule,
    AdminModule,
    AuthModule,
    EmailModule,
    UsersModule,
    VenueModule,
    PyachokModule,
    CommentModule,
    TagModule,
    NewsModule,
    TopModule,
    LoggerModule,
    RepositoryModule,
    FileStorageModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
