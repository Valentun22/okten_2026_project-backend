import { PickType } from '@nestjs/swagger';

import { BaseVenueResDto } from './base-venue.res.dto';

export class VenueListItemResDto extends PickType(BaseVenueResDto, [
  'id',
  'name',
  'avatarVenue',
  'created',
  'city',
  'averageCheck',
  'categories',
  'description',
  'tags',
  'ratingAvg',
  'ratingCount',
  'isActive',
  'isLiked',
  'user',
  'isFavorite',
]) {}
