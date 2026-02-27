import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { UserEntity } from '../../../database/entities/user.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { AuthCacheService } from '../../auth/services/auth-cache.service';
import { CommentListQueryDto } from '../../comments/dto/req/comment-list.query.dto';
import { CommentMapper } from '../../comments/services/comment.mapper';
import { ContentType } from '../../file-storage/enums/content-type.enum';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { LoggerService } from '../../logger/logger.service';
import { CommentRepository } from '../../repository/services/comment.repository';
import { FollowRepository } from '../../repository/services/follow.repository';
import { RatingVenueRepository } from '../../repository/services/rating-venue.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { VenueMapper } from '../../venue/services/venue.mapper';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { MyCommentListResDto } from '../dto/res/my-comment-list.res.dto';
import {
  MyRatingListResDto,
  VenueWithMyRatingItemResDto,
} from '../dto/res/my-rating-list.res.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly authCacheService: AuthCacheService,
    private readonly followRepository: FollowRepository,
    private readonly commentRepository: CommentRepository,
    private readonly ratingVenueRepository: RatingVenueRepository,
  ) {}

  public async findMe(userData: IUserData): Promise<UserEntity> {
    return await this.userRepository.findOneBy({ id: userData.userId });
  }

  public async updateMe(
    userData: IUserData,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    this.userRepository.merge(user, dto);
    return await this.userRepository.save(user);
  }

  public async removeMe(userData: IUserData): Promise<void> {
    await this.userRepository.delete({ id: userData.userId });
    await this.authCacheService.deleteToken(userData.userId, userData.deviceId);
  }

  public async findOne(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return user;
  }

  public async follow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot follow yourself');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });

    if (follow) {
      throw new ConflictException('You already follow this user');
    }
    await this.followRepository.save(
      this.followRepository.create({
        follower_id: userData.userId,
        following_id: userId,
      }),
    );
  }

  public async unfollow(userData: IUserData, userId: string): Promise<void> {
    if (userData.userId === userId) {
      throw new ConflictException('You cannot unfollow yourself');
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const follow = await this.followRepository.findOneBy({
      follower_id: userData.userId,
      following_id: userId,
    });

    if (!follow) {
      throw new ConflictException('You do not follow this user');
    }
    await this.followRepository.delete({ id: follow.id });
  }

  public async isEmailExistOrThrow(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
  }

  public async uploadAvatar(
    userData: IUserData,
    avatar: Express.Multer.File,
  ): Promise<void> {
    const image = await this.fileStorageService.uploadFile(
      avatar,
      ContentType.AVATAR,
      userData.userId,
    );
    await this.userRepository.update(userData.userId, { image });
  }

  public async deleteAvatar(userData: IUserData): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userData.userId });
    if (user.image) {
      await this.fileStorageService.deleteFile(user.image);
      await this.userRepository.save(
        this.userRepository.merge(user, { image: null }),
      );
    }
  }

  public async addCriticRole(userData: IUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
      select: ['id', 'name', 'email', 'bio', 'image', 'role'],
    });

    const roles = new Set(user.role ?? []);
    roles.add(RoleUserEnum.USER);
    roles.add(RoleUserEnum.CRITIC);

    user.role = Array.from(roles);
    return await this.userRepository.save(user);
  }

  public async removeCriticRole(userData: IUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
      select: ['id', 'name', 'email', 'bio', 'image', 'role'],
    });

    const roles = new Set(user.role ?? []);
    roles.delete(RoleUserEnum.CRITIC);

    if (roles.size === 0) roles.add(RoleUserEnum.USER);

    user.role = Array.from(roles);
    return await this.userRepository.save(user);
  }

  public async addVenueAdminRole(userData: IUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
      select: ['id', 'name', 'email', 'bio', 'image', 'role'],
    });

    const roles = new Set(user.role ?? []);
    roles.add(RoleUserEnum.USER);
    roles.add(RoleUserEnum.VENUE_ADMIN);

    user.role = Array.from(roles);
    return await this.userRepository.save(user);
  }

  public async removeVenueAdminRole(userData: IUserData): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userData.userId },
      select: ['id', 'name', 'email', 'bio', 'image', 'role'],
    });

    const roles = new Set(user.role ?? []);
    roles.delete(RoleUserEnum.VENUE_ADMIN);

    if (roles.size === 0) roles.add(RoleUserEnum.USER);

    user.role = Array.from(roles);
    return await this.userRepository.save(user);
  }

  public async getMyFavoriteVenues(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteVenues'],
    });

    const venues = user.favoriteVenues ?? [];

    return venues.map((v) =>
      VenueMapper.toResponseDTO(v, { isFavorite: true }),
    );
  }

  public async getMyRatings(
    userData: IUserData,
    query: CommentListQueryDto,
  ): Promise<MyRatingListResDto> {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    const [rows, total] = await this.ratingVenueRepository.findMyRatedVenues(
      userData.userId,
      limit,
      offset,
    );

    const data: VenueWithMyRatingItemResDto[] = rows.map((rv) => ({
      ...VenueMapper.toResponseListItemDTO(rv.venue),
      myRating: rv.rating,
    }));

    return { data, total, limit, offset };
  }

  public async getMyComments(
    userData: IUserData,
    query: CommentListQueryDto,
  ): Promise<MyCommentListResDto> {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    const [comments, total] = await this.commentRepository.findMyComments(
      userData.userId,
      limit,
      offset,
    );

    return {
      data: comments.map((c) => CommentMapper.toResponseDTO(userData, c)),
      total,
      limit,
      offset,
    };
  }
}
