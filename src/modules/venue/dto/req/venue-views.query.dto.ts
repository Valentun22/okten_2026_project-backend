import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class VenueViewsQueryDto {
  @ApiPropertyOptional({ example: '2026-02-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ example: '2026-02-20T23:59:59.000Z' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ example: 'day', enum: ['day', 'hour'] })
  @IsOptional()
  @IsIn(['day', 'hour'])
  bucket?: 'day' | 'hour' = 'day';

  @Transform(({ obj }) => (obj.from ? new Date(obj.from) : undefined))
  get fromDate(): Date | undefined {
    return this.from ? new Date(this.from) : undefined;
  }

  @Transform(({ obj }) => (obj.to ? new Date(obj.to) : undefined))
  get toDate(): Date | undefined {
    return this.to ? new Date(this.to) : undefined;
  }
}
