import { Module } from '@nestjs/common';

import { TopController } from './top.controller';
import { TopService } from './top.service';

@Module({
  controllers: [TopController],
  providers: [TopService],
})
export class TopModule {}
