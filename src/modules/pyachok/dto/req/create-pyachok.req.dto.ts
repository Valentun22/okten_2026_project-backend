import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { PyachokGenderEnum } from '../../enums/pyachok-gender.enum';
import { PyachokPayerEnum } from '../../enums/pyachok-payer.enum';

export class CreatePyachokReqDto {
  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  peopleCount?: number;

  @IsOptional()
  @IsEnum(PyachokGenderEnum)
  genderPreference?: PyachokGenderEnum;

  @IsOptional()
  @IsEnum(PyachokPayerEnum)
  payer?: PyachokPayerEnum;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  expectedBudget?: number;
}
