import { IsEnum } from 'class-validator';

import { ComplaintStatusEnum } from '../../../../database/entities/enums/complaint-status.enum';

export class AdminUpdateComplaintStatusReqDto {
  @IsEnum(ComplaintStatusEnum)
  status: ComplaintStatusEnum;
}
