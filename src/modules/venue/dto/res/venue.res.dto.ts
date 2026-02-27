import { PickType } from '@nestjs/swagger';

import { BaseVenueResDto } from './base-venue.res.dto';

export class VenueResDto extends PickType(BaseVenueResDto, [
  'id',
  'created',
  'updated',
  'name',
  'avatarVenue',
  'city',
  'address',
  'description',
  'averageCheck',
  'categories',
  'isActive',
  'hasWiFi',
  'hasParking',
  'liveMusic',
  'petFriendly',
  'hasTerrace',
  'smokingAllowed',
  'cardPayment',
  'tags',
  'ratingAvg',
  'ratingCount',
  'isLiked',
  'user',
  'isFavorite',
]) {}
