import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseUserReqDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Transform(TransformHelper.trim)
  @Type(() => String)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(0, 5000)
  image?: string;

  @IsOptional()
  @ValidateIf((o) => o.birthdate !== '' && o.birthdate !== null)
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Дата має бути у форматі YYYY-MM-DD',
  })
  birthdate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  gender?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  instagram?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  interests?: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @IsString()
  @Length(0, 300)
  @Matches(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)
  email: string;

  @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;
}
