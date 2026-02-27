import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateNewsActiveReqDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isActive: boolean;
}
