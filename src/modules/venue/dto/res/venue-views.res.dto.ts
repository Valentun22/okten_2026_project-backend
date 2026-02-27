export class VenueViewsSummaryResDto {
  total: number;
  uniqueUsers: number;
  uniqueIps: number;
}

export class VenueViewsTimePointResDto {
  bucket: string;
  count: number;
}
