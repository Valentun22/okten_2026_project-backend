import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { VenueService } from './services/venue.service';
import { VenueController } from './venue.controller';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
