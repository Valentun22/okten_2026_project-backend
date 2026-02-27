import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

class ReorderTopCategoryVenueItemDto {
  @ApiProperty()
  @IsUUID()
  venueId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class AdminReorderTopCategoryVenuesReqDto {
  @ApiProperty({ type: [ReorderTopCategoryVenueItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTopCategoryVenueItemDto)
  items: ReorderTopCategoryVenueItemDto[];
}
