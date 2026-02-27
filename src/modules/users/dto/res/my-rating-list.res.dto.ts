import { ApiProperty } from '@nestjs/swagger';

import { VenueListItemResDto } from '../../../venue/dto/res/venue-list-item.res.dto';

export class VenueWithMyRatingItemResDto extends VenueListItemResDto {
  @ApiProperty({ example: 8 })
  myRating: number;
}

export class MyRatingListResDto {
  data: VenueWithMyRatingItemResDto[];
  total: number;
  limit: number;
  offset: number;
}
