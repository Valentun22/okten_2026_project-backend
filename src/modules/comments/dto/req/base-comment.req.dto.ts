import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { CommentRecommendationEnum } from '../../../../database/entities/enums/comment-recommendation';

export class BaseCommentReqDto {
  @IsString()
  @Length(1, 5000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  body: string;

  @IsString()
  @Length(1, 150)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  title: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  image_check?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsEnum(CommentRecommendationEnum)
  recommendation?: CommentRecommendationEnum;
}
