import { UserResDto } from '../../../users/dto/res/user.res.dto';

export class AdminUserListResDto {
  data: UserResDto[];
  total: number;
  limit: number;
  offset: number;
}
