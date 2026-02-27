import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import { NewsTypeEnum } from '../../../../database/entities/enums/news-type.enum';

export class NewsListQueryDto {
  @IsOptional()
  @IsEnum(NewsTypeEnum)
  type?: NewsTypeEnum;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
}
