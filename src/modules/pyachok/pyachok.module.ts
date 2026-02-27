import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { RepositoryModule } from '../repository/repository.module';
import { PyachokController } from './pyachok.controller';
import { PyachokService } from './services/pyachok.service';

@Module({
  imports: [RepositoryModule, AuthModule, EmailModule],
  controllers: [PyachokController],
  providers: [PyachokService],
  exports: [PyachokService],
})
export class PyachokModule {}
