import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CommentEntity } from '../../../database/entities/comment.entity';
import { CommentRecommendationEnum } from '../../../database/entities/enums/comment-recommendation';
import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CommentRepository } from '../../repository/services/comment.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { VenueRepository } from '../../repository/services/venue.repository';
import { CommentListQueryDto } from '../dto/req/comment-list.query.dto';
import { CreateCommentReqDto } from '../dto/req/create-comment.req.dto';
import { UpdateCommentReqDto } from '../dto/req/update-comment.req.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly venueRepository: VenueRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async getListByVenue(
    userData: IUserData,
    venueId: string,
    query: CommentListQueryDto,
  ): Promise<[CommentEntity[], number]> {
    await this.checkIsVenueExistOrThrow(venueId);
    return await this.commentRepository.getListByVenue(
      userData.userId,
      venueId,
      query,
    );
  }

  public async create(
    userData: IUserData,
    venueId: string,
    dto: CreateCommentReqDto,
  ): Promise<CommentEntity> {
    await this.checkIsVenueExistOrThrow(venueId);

    await this.assertRecommendationPermissions(userData.userId, dto);

    const comment = this.commentRepository.create({
      ...dto,
      user_id: userData.userId,
      venue_id: venueId,
    });

    return await this.commentRepository.save(comment);
  }

  public async getById(
    userData: IUserData,
    commentId: string,
  ): Promise<CommentEntity> {
    try {
      return await this.commentRepository.getByIdOrFail(
        userData.userId,
        commentId,
      );
    } catch {
      throw new NotFoundException('Comment not found');
    }
  }

  public async update(
    userData: IUserData,
    commentId: string,
    dto: UpdateCommentReqDto,
  ): Promise<CommentEntity> {
    const comment = await this.getById(userData, commentId);

    if (comment.user_id !== userData.userId) {
      throw new ForbiddenException('You can update only your comment');
    }

    await this.assertRecommendationPermissions(userData.userId, dto);

    Object.assign(comment, dto);
    return await this.commentRepository.save(comment);
  }

  public async delete(userData: IUserData, commentId: string): Promise<void> {
    const comment = await this.getById(userData, commentId);

    if (comment.user_id !== userData.userId) {
      throw new ForbiddenException('You can delete only your comment');
    }

    await this.commentRepository.remove(comment);
  }

  private async assertRecommendationPermissions(
    userId: string,
    dto: { recommendation?: CommentRecommendationEnum },
  ): Promise<void> {
    if (dto.recommendation === undefined) return;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'role'],
    });

    const isCritic = (user?.role ?? []).includes(RoleUserEnum.CRITIC);

    if (!isCritic) {
      throw new ForbiddenException(
        'Only critic can set recommend / not recommend marker',
      );
    }
  }

  private async checkIsVenueExistOrThrow(venueId: string): Promise<void> {
    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) throw new NotFoundException('Venue not found');
  }
}
