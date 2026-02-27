import { CommentEntity } from '../../../database/entities/comment.entity';
import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { UserMapper } from '../../users/services/user.mapper';
import { CommentListQueryDto } from '../dto/req/comment-list.query.dto';
import { CommentResDto } from '../dto/res/comment.res.dto';
import { CommentListResDto } from '../dto/res/comment-list.res.dto';
import { CommentListItemResDto } from '../dto/res/comment-list-item.res.dto';

export class CommentMapper {
  public static toResponseListDTO(
    userData: IUserData,
    entities: CommentEntity[],
    total: number,
    query: CommentListQueryDto,
  ): CommentListResDto {
    return {
      data: entities.map((e) => this.toResponseListItemDTO(userData, e)),
      total,
      limit: query.limit ?? 10,
      offset: query.offset ?? 0,
    };
  }

  public static toResponseListItemDTO(
    userData: IUserData,
    entity: CommentEntity,
  ): CommentListItemResDto {
    const roles = entity.user?.role ?? [];
    return {
      id: entity.id,
      title: entity.title,
      body: entity.body,
      image_check: entity.image_check ?? null,
      rating: entity.rating,
      created: entity.created,
      updated: entity.updated,
      recommendation: entity.recommendation ?? null,
      user: UserMapper.toResponseDTO(entity.user),
      isCritic: roles.includes(RoleUserEnum.CRITIC),
      isOwner: entity.user_id === userData.userId,
    };
  }

  public static toResponseDTO(
    userData: IUserData,
    entity: CommentEntity,
  ): CommentResDto {
    return {
      ...this.toResponseListItemDTO(userData, entity),
      venueId: entity.venue_id,
    };
  }
}
