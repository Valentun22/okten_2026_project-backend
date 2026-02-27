import { RoleUserEnum } from '../../../database/entities/enums/role.enum';

export interface IUserData {
  userId: string;
  deviceId: string;
  email: string;
  roles: RoleUserEnum[];
}
