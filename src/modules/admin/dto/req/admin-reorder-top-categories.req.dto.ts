import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';

class ReorderTopCategoryItemDto {
  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  order: number;
}

export class AdminReorderTopCategoriesReqDto {
  @ApiProperty({ type: [ReorderTopCategoryItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTopCategoryItemDto)
  items: ReorderTopCategoryItemDto[];
}
