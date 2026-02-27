import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { RoleUserEnum } from '../../../../database/entities/enums/role.enum';

export class AdminUpdateUserReqDto {
  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'about me...' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.site.com/avatar.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ isArray: true, enum: RoleUserEnum })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleUserEnum, { each: true })
  role?: RoleUserEnum[];
}
