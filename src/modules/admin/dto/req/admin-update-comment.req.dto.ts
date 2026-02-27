import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CommentRecommendationEnum } from '../../../../database/entities/enums/comment-recommendation';


export class AdminUpdateCommentReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ example: 8, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  rating?: number;

  @ApiPropertyOptional({
    enum: CommentRecommendationEnum,
    example: CommentRecommendationEnum.RECOMMEND,
  })
  @IsOptional()
  @IsEnum(CommentRecommendationEnum)
  recommendation?: CommentRecommendationEnum | null;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  image_check?: string | null;
}
