import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { VenueCategoryEnum } from '../../../../database/entities/enums/place-type.enum';

export enum VenueSortByEnum {
  RATING = 'rating',
  AVERAGE_CHECK = 'averageCheck',
  CREATED = 'created',
  NAME = 'name',
}

export enum SortOrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class VenueListQueryDto {
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

  @IsString()
  @IsOptional()
  tag?: string;

  @IsString()
  @IsOptional()
  likes?: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;

  // Filters
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageCheckFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageCheckTo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  ratingFrom?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  ratingTo?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(VenueCategoryEnum, { each: true })
  @Transform(TransformHelper.toArray)
  categories?: VenueCategoryEnum[];

  // Features (apply filter only when true)
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasWiFi?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasParking?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  liveMusic?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  petFriendly?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasTerrace?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  smokingAllowed?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  cardPayment?: boolean;

  // Sorting
  @IsOptional()
  @IsEnum(VenueSortByEnum)
  sortBy?: VenueSortByEnum = VenueSortByEnum.CREATED;

  @IsOptional()
  @IsEnum(SortOrderEnum)
  sortOrder?: SortOrderEnum = SortOrderEnum.DESC;
}
