import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { NewsController } from './news.controller';
import { NewsService } from './services/news.service';

@Module({
  imports: [RepositoryModule, AuthModule],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
