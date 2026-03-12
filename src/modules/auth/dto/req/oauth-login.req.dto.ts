import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OAuthProviderEnum } from '../../../../database/entities/enums/oauth-provider.enum';

export class OAuthLoginReqDto {
  @ApiProperty({ enum: OAuthProviderEnum })
  @IsEnum(OAuthProviderEnum)
  provider: OAuthProviderEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deviceId?: string;
}