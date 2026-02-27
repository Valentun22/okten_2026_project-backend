import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { VenueCategoryEnum } from '../../../../database/entities/enums/place-type.enum';

class WorkingHoursDto {
  @IsOptional() @IsString() mon?: string;
  @IsOptional() @IsString() tue?: string;
  @IsOptional() @IsString() wed?: string;
  @IsOptional() @IsString() thu?: string;
  @IsOptional() @IsString() fri?: string;
  @IsOptional() @IsString() sat?: string;
  @IsOptional() @IsString() sun?: string;
}

class SocialsDto {
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() telegram?: string;
}

export class BaseVenueReqDto {
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  @Type(() => String)
  avatarVenue?: string;

  @IsOptional()
  @IsString()
  @Length(0, 3000)
  @Type(() => String)
  logoVenue?: string;

  @IsOptional()
  @IsArray()
  @Transform(TransformHelper.trimArray)
  @IsString({ each: true })
  image?: string[];

  @IsOptional()
  @IsString()
  @Type(() => String)
  menu?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  averageCheck?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto;

  @IsString()
  @Transform(TransformHelper.trim)
  @Type(() => String)
  city: string;

  @IsString()
  @Transform(TransformHelper.trim)
  @Type(() => String)
  address: string;

  @IsOptional()
  @IsArray()
  @IsEnum(VenueCategoryEnum, { each: true })
  categories?: VenueCategoryEnum[];

  @IsOptional()
  @Matches(/^\+?[0-9]{10,15}$/)
  @Type(() => String)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @Type(() => String)
  email?: string;

  @IsOptional()
  @IsUrl()
  @Type(() => String)
  website?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SocialsDto)
  socials?: SocialsDto;

  @IsString()
  @Length(0, 30000)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  description: string;

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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Length(3, 30, { each: true })
  @ArrayMaxSize(5)
  @Transform(TransformHelper.trimArray)
  @Transform(TransformHelper.uniqueItems)
  @Transform(TransformHelper.toLowerCaseArray)
  tags?: string[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFavorite?: boolean;
}
