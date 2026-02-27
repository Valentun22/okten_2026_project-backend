import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { VenueCategoryEnum } from '../../../../database/entities/enums/place-type.enum';

class WorkingHoursDto {
  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  mon?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  tue?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  wed?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  thu?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' })
  @IsOptional()
  @IsString()
  fri?: string;
  @ApiPropertyOptional({ example: '10:00-23:00' })
  @IsOptional()
  @IsString()
  sat?: string;
  @ApiPropertyOptional({ example: '10:00-23:00' })
  @IsOptional()
  @IsString()
  sun?: string;
}

class SocialsDto {
  @ApiPropertyOptional({ example: 'https://instagram.com/venue' })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/venue' })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://t.me/venue' })
  @IsOptional()
  @IsString()
  telegram?: string;
}

export class AdminUpdateVenueReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarVenue?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoVenue?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  image?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  menu?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  averageCheck?: number;

  @ApiPropertyOptional({ type: WorkingHoursDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ isArray: true, enum: VenueCategoryEnum })
  @IsOptional()
  @IsArray()
  @IsEnum(VenueCategoryEnum, { each: true })
  categories?: VenueCategoryEnum[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ type: SocialsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialsDto)
  socials?: SocialsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasWiFi?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasParking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  liveMusic?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  petFriendly?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasTerrace?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  smokingAllowed?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  cardPayment?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Tag names' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
