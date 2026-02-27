import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString, Length } from 'class-validator';

import { NewsTypeEnum } from '../../../../database/entities/enums/news-type.enum';

export class CreateNewsReqDto {
  @ApiProperty({ example: 'New cocktail promotion' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ example: 'Description of the promotion/event/news...' })
  @IsString()
  @Length(1, 5000)
  body: string;

  @ApiPropertyOptional({
    enum: NewsTypeEnum,
    default: NewsTypeEnum.GENERAL,
    description: 'general | promotion | event',
  })
  @IsOptional()
  @IsEnum(NewsTypeEnum)
  type?: NewsTypeEnum;

  @ApiPropertyOptional({ example: 'https://....jpg' })
  @IsOptional()
  @IsString()
  avatarNews?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['https://...1.jpg', 'https://...2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
