import { ApiProperty } from '@nestjs/swagger';

import { VenueResDto } from '../../../venue/dto/res/venue.res.dto';
import { TopCategoryResDto } from './top-category.res.dto';

export class TopCategoryWithVenuesResDto {
  @ApiProperty({ type: TopCategoryResDto })
  category: TopCategoryResDto;

  @ApiProperty({ type: [VenueResDto] })
  venues: VenueResDto[];
}
