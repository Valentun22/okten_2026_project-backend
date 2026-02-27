import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { NewsTypeEnum } from '../../../../database/entities/enums/news-type.enum';

export class UpdateNewsReqDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated body' })
  @IsOptional()
  @IsString()
  @Length(1, 5000)
  body?: string;

  @ApiPropertyOptional({
    enum: NewsTypeEnum,
    description: 'general | promotion | event',
  })
  @IsOptional()
  @IsEnum(NewsTypeEnum)
  type?: NewsTypeEnum;

  @ApiPropertyOptional({ example: 'https://...jpg' })
  @IsOptional()
  @IsString()
  avatarNews?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
