import { ApiProperty } from '@nestjs/swagger';

import { ComplaintResDto } from './complaint.res.dto';

export class ComplaintListResDto {
  @ApiProperty({ type: [ComplaintResDto] })
  data: ComplaintResDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
