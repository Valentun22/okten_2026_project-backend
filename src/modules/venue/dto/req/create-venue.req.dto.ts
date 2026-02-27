import { PickType } from '@nestjs/swagger';

import { BaseVenueReqDto } from './base-venue.req.dto';

export class CreateVenueReqDto extends PickType(BaseVenueReqDto, [
  'name',
  'avatarVenue',
  'logoVenue',
  'image',
  'menu',
  'averageCheck',
  'workingHours',
  'city',
  'address',
  'categories',
  'phone',
  'email',
  'website',
  'socials',
  'description',
  'hasWiFi',
  'hasParking',
  'liveMusic',
  'petFriendly',
  'hasTerrace',
  'smokingAllowed',
  'cardPayment',
  'tags',
]) {}
