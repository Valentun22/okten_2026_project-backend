import { ApiProperty } from '@nestjs/swagger';

import { ComplaintStatusEnum } from '../../../../database/entities/enums/complaint-status.enum';
import { ComplaintTypeEnum } from '../../../../database/entities/enums/complaint-type.enum';

export class ComplaintUserPreviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  image?: string;
}

export class ComplaintVenuePreviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class ComplaintResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  venueId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ComplaintTypeEnum })
  type: ComplaintTypeEnum;

  @ApiProperty({ required: false })
  targetId?: string;

  @ApiProperty()
  reason: string;

  @ApiProperty({ enum: ComplaintStatusEnum })
  status: ComplaintStatusEnum;

  @ApiProperty()
  created: Date;

  @ApiProperty({ required: false, type: ComplaintUserPreviewDto })
  user?: ComplaintUserPreviewDto;

  @ApiProperty({ required: false, type: ComplaintVenuePreviewDto })
  venue?: ComplaintVenuePreviewDto;
}
