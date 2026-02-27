import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ComplaintTypeEnum } from '../../../../database/entities/enums/complaint-type.enum';

export class CreateComplaintReqDto {
  @IsOptional()
  @IsEnum(ComplaintTypeEnum)
  type?: ComplaintTypeEnum = ComplaintTypeEnum.VENUE;

  // For NEWS/COMMENT complaints, client may pass the target id.
  @IsOptional()
  @Type(() => String)
  @IsString()
  targetId?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  reason: string;
}
