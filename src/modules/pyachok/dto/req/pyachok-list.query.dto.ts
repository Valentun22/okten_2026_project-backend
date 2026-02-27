import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { PyachokStatusEnum } from '../../enums/pyachok-status.enum';

export class PyachokListQueryDto {
  @IsOptional()
  @IsEnum(PyachokStatusEnum)
  status?: PyachokStatusEnum;

  @IsOptional()
  date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
