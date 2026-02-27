import { Transform, Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class ContactVenueManagerReqDto {
  @IsString()
  @Length(1, 4000)
  @Type(() => String)
  @Transform(TransformHelper.trim)
  message: string;
}
