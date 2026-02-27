import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ComplaintStatusEnum } from '../../../../database/entities/enums/complaint-status.enum';
import { ComplaintTypeEnum } from '../../../../database/entities/enums/complaint-type.enum';

export class ComplaintListQueryDto {
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;

  @IsOptional()
  @IsEnum(ComplaintStatusEnum)
  status?: ComplaintStatusEnum;

  @IsOptional()
  @IsEnum(ComplaintTypeEnum)
  type?: ComplaintTypeEnum;

  // ISO date string (YYYY-MM-DD)
  @IsOptional()
  @IsString()
  from?: string;

  // ISO date string (YYYY-MM-DD)
  @IsOptional()
  @IsString()
  to?: string;

  public get fromDate(): Date | undefined {
    if (!this.from) return undefined;
    const d = new Date(this.from);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }

  public get toDate(): Date | undefined {
    if (!this.to) return undefined;
    const d = new Date(this.to);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
}
