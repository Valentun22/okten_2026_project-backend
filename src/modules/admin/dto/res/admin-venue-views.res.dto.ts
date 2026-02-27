export class AdminVenueViewsSummaryResDto {
  total: number;
  uniqueUsers: number;
  uniqueIps: number;
}

export class AdminVenueViewsTimePointResDto {
  bucket: string;
  count: number;
}
