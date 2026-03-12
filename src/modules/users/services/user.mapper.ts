import { ConfigStaticService } from '../../../config/config-static';
import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { IJwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserResDto } from '../dto/res/user.res.dto';

export class UserMapper {
  public static toResponseDTO(data: UserEntity): UserResDto {
    const awsConfig = ConfigStaticService.get().aws;
    const roles = data.role ?? [];
    const resolveImage = (img?: string | null): string | null => {
      if (!img) return null;
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      return `${awsConfig.bucketUrl}/${img}`;
    };

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      image: resolveImage(data.image),
      bio: data.bio,
      birthdate: data.birthdate ?? null,
      city: data.city ?? null,
      gender: data.gender ?? null,
      instagram: data.instagram ?? null,
      interests: data.interests ?? null,
      role: data.role ?? [],
      isFollowed: data.followings?.length > 0 || false,
      isCritic: roles.includes(RoleUserEnum.CRITIC),
    };
  }

  public static toIUserData(user: UserEntity, payload: IJwtPayload): IUserData {
    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      email: user.email,
      roles: user.role,
    };
  }
}
