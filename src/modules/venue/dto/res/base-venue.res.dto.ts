import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { VenueCategoryEnum } from '../../../../database/entities/enums/place-type.enum';
import { UserResDto } from '../../../users/dto/res/user.res.dto';

class WorkingHoursResDto {
  @ApiPropertyOptional({ example: '09:00-22:00' }) mon?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' }) tue?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' }) wed?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' }) thu?: string;
  @ApiPropertyOptional({ example: '09:00-22:00' }) fri?: string;
  @ApiPropertyOptional({ example: '10:00-23:00' }) sat?: string;
  @ApiPropertyOptional({ example: '10:00-23:00' }) sun?: string;
}

class SocialsResDto {
  @ApiPropertyOptional({ example: 'https://instagram.com/venue' })
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/venue' })
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://t.me/venue' })
  telegram?: string;
}

export class BaseVenueResDto {
  @ApiProperty({
    example: '796cea24-a328-4463-a5e1-85a779e4780f',
    description: 'Venue ID',
  })
  id: string;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Venue Created Date',
  })
  @Transform(({ obj }) => obj.createdAt ?? obj.created)
  created: Date;

  @ApiProperty({
    example: '2021-09-29T10:00:00.000Z',
    description: 'Venue Updated Date',
  })
  @Transform(({ obj }) => obj.updatedAt ?? obj.updated)
  updated: Date;

  @ApiProperty({ example: 'Venue Title', description: 'Venue Title' })
  name: string;

  @ApiPropertyOptional({
    example: 'https://cdn.site.com/venue/avatar.jpg',
    description: 'Venue avatar',
  })
  avatarVenue?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.site.com/venue/logo.png',
    description: 'Venue logo',
  })
  logoVenue?: string;

  @ApiPropertyOptional({
    example: [
      'https://cdn.site.com/venue/1.jpg',
      'https://cdn.site.com/venue/2.jpg',
    ],
    description: 'Venue images',
  })
  image?: string[];

  @ApiPropertyOptional({
    example: 'https://cdn.site.com/menu.pdf',
    description: 'Venue menu',
  })
  menu?: string;

  @ApiPropertyOptional({ example: 150, description: 'Venue average check' })
  averageCheck?: number;

  @ApiPropertyOptional({ description: 'Venue working hours' })
  @ValidateNested()
  @Type(() => WorkingHoursResDto)
  workingHours?: WorkingHoursResDto;

  @ApiProperty({ example: 'Lviv', description: 'City' })
  city: string;

  @ApiProperty({ example: 'Korzo 10', description: 'Address' })
  address: string;

  @ApiPropertyOptional({
    example: [VenueCategoryEnum.BAR],
    description: 'Venue categories',
    enum: VenueCategoryEnum,
    isArray: true,
  })
  categories?: VenueCategoryEnum[];

  @ApiProperty({ example: false, description: 'Is moderated' })
  isModerated: boolean;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiPropertyOptional({ example: '+380501234567', description: 'Phone' })
  phone?: string;

  @ApiPropertyOptional({ example: 'venue@gmail.com', description: 'Email' })
  email?: string;

  @ApiPropertyOptional({
    example: 'https://venue.com',
    description: 'Website URL',
  })
  website?: string;

  @ApiPropertyOptional({ description: 'Social networks' })
  @ValidateNested()
  @Type(() => SocialsResDto)
  socials?: SocialsResDto;

  @ApiProperty({
    example: 'Venue Description',
    description: 'Venue Description',
  })
  description: string;

  @ApiProperty({ example: false }) hasWiFi: boolean;
  @ApiProperty({ example: false }) hasParking: boolean;
  @ApiProperty({ example: false }) liveMusic: boolean;
  @ApiProperty({ example: false }) petFriendly: boolean;
  @ApiProperty({ example: false }) hasTerrace: boolean;
  @ApiProperty({ example: false }) smokingAllowed: boolean;
  @ApiProperty({ example: false }) cardPayment: boolean;

  @ApiPropertyOptional({ example: 8.6, description: 'Average venue rating (1..10)' })
  ratingAvg?: number;

  @ApiPropertyOptional({ example: 124, description: 'How many ratings were left' })
  ratingCount?: number;

  @ApiPropertyOptional({
    example: ['bar', 'pub'],
    description: 'Venue tags',
  })
  @Transform(({ obj }) => {
    const tags = obj?.tags;
    if (!Array.isArray(tags)) return [];
    return tags.map((t) => t.name);
  })
  tags?: string[];

  @ApiProperty({
    example: true,
    description: 'Is Venue Liked',
  })
  isLiked: boolean;

  user?: UserResDto;

  isFavorite: boolean;
}
