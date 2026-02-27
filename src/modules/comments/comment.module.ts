import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { RepositoryModule } from '../repository/repository.module';
import { CommentController } from './comment.controller';
import { CommentService } from './services/comment.service';
import { CommentS3Service } from './services/comment-s3.service';

@Module({
  imports: [RepositoryModule, AuthModule],
  controllers: [CommentController],
  providers: [CommentService, CommentS3Service],
})
export class CommentModule {}
