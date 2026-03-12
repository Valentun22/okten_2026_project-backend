import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';
import { RepositoryModule } from '../repository/repository.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { OAuthVerifyService } from './services/oauth-verify.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    JwtModule,
    RepositoryModule,
    RedisModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    AuthService,
    TokenService,
    AuthCacheService,
    JwtAccessGuard,
    OAuthVerifyService,
  ],
  exports: [TokenService, AuthCacheService, JwtAccessGuard],
})
export class AuthModule {}
