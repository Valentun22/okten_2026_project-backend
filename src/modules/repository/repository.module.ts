import { Global, Module } from '@nestjs/common';

import { AppSettingRepository } from './services/app-setting.repository';
import { CommentRepository } from './services/comment.repository';
import { ComplaintRepository } from './services/complaint.repository';
import { FollowRepository } from './services/follow.repository';
import { LikeRepository } from './services/like.repository';
import { NewsRepository } from './services/news.repository';
import { PyachokRepository } from './services/pyachok.repository';
import { RatingVenueRepository } from './services/rating-venue.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';
import { TagRepository } from './services/tag.repository';
import { TopRepository } from './services/top.repository';
import { UserRepository } from './services/user.repository';
import { VenueRepository } from './services/venue.repository';
import { VenueViewRepository } from './services/venue-view.repository';

const repositories = [
  AppSettingRepository,
  VenueRepository,
  CommentRepository,
  ComplaintRepository,
  FollowRepository,
  LikeRepository,
  RefreshTokenRepository,
  TagRepository,
  PyachokRepository,
  UserRepository,
  NewsRepository,
  RatingVenueRepository,
  VenueViewRepository,
  TopRepository,
];

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: repositories,
  exports: repositories,
})
export class RepositoryModule {}
