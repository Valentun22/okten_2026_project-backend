import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';
import { UserRepository } from 'src/modules/repository/services/user.repository';

import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { RatingVenueEntity } from '../../../database/entities/rating-venue.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { CommentResDto } from '../../comments/dto/res/comment.res.dto';
import { CommentMapper } from '../../comments/services/comment.mapper';
import { CommentRepository } from '../../repository/services/comment.repository';
import { RatingVenueRepository } from '../../repository/services/rating-venue.repository';
import { TagRepository } from '../../repository/services/tag.repository';
import { VenueRepository } from '../../repository/services/venue.repository';
import { VenueViewRepository } from '../../repository/services/venue-view.repository';
import { ComplaintRepository } from '../../repository/services/complaint.repository';
import { TopRepository } from '../../repository/services/top.repository';
import { UserMapper } from '../../users/services/user.mapper';
import { ComplaintListResDto } from '../../venue/dto/res/complaint-list.res.dto';
import { ComplaintResDto } from '../../venue/dto/res/complaint.res.dto';
import { ComplaintMapper } from '../../venue/services/complaint.mapper';
import { VenueListQueryDto } from '../../venue/dto/req/venue-list.query.dto';
import { VenueResDto } from '../../venue/dto/res/venue.res.dto';
import { VenueListResDto } from '../../venue/dto/res/venue-list.res.dto';
import { VenueMapper } from '../../venue/services/venue.mapper';
import { AdminUpdateCommentReqDto } from '../dto/req/admin-update-comment.req.dto';
import { AdminUpdateUserReqDto } from '../dto/req/admin-update-user.req.dto';
import { AdminUpdateVenueReqDto } from '../dto/req/admin-update-venue.req.dto';
import { AdminComplaintListQueryDto } from '../dto/req/admin-complaint-list.query.dto';
import { AdminUpdateComplaintStatusReqDto } from '../dto/req/admin-update-complaint-status.req.dto';
import { AdminUserListQueryDto } from '../dto/req/admin-user-list.query.dto.';
import { AdminUserListResDto } from '../dto/req/admin-user-list.res.dto';
import { AdminVenueListQueryDto } from '../dto/req/admin-venue-list.query.dto';
import { AdminVenueViewsQueryDto } from '../dto/req/admin-venue-views.query.dto';
import { AdminAddVenueToTopCategoryReqDto } from '../dto/req/admin-add-venue-to-top-category.req.dto';
import { AdminCreateTopCategoryReqDto } from '../dto/req/admin-create-top-category.req.dto';
import { AdminReorderTopCategoriesReqDto } from '../dto/req/admin-reorder-top-categories.req.dto';
import { AdminReorderTopCategoryVenuesReqDto } from '../dto/req/admin-reorder-top-category-venues.req.dto';
import { AdminUpdateTopCategoryReqDto } from '../dto/req/admin-update-top-category.req.dto';
import {
  AdminVenueViewsSummaryResDto,
  AdminVenueViewsTimePointResDto,
} from '../dto/res/admin-venue-views.res.dto';
import { TopCategoryEntity } from '../../../database/entities/top-category.entity';
import { TopCategoryVenueEntity } from '../../../database/entities/top-category-venue.entity';
import { TopCategoryResDto } from '../../top/dto/res/top-category.res.dto';
import { TopCategoryWithVenuesResDto } from '../../top/dto/res/top-category-with-venues.res.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly venueRepository: VenueRepository,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
    private readonly venueViewRepository: VenueViewRepository,
    private readonly ratingVenueRepository: RatingVenueRepository,
    private readonly tagRepository: TagRepository,
    private readonly complaintRepository: ComplaintRepository,
    private readonly topRepository: TopRepository,
  ) {}

  private assertSuperAdmin(userData: IUserData): void {
    const roles = userData.roles ?? [];
    if (!roles.includes(RoleUserEnum.SUPERADMIN)) {
      throw new ForbiddenException('Only SUPERADMIN can access this endpoint');
    }
  }

  public async getPendingVenues(
    userData: IUserData,
    query: VenueListQueryDto,
  ): Promise<VenueListResDto> {
    this.assertSuperAdmin(userData);

    const qb = this.venueRepository.createQueryBuilder('venue');

    qb.leftJoinAndSelect('venue.tags', 'tag');
    qb.leftJoinAndSelect('venue.user', 'user');
    qb.leftJoinAndSelect('venue.likes', 'like', 'like.user_id = :userId');
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :userId',
    );
    qb.setParameter('userId', userData.userId);

    qb.andWhere('venue.isModerated = false');

    if (query.search) {
      qb.andWhere('CONCAT(venue.name, venue.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }

    qb.orderBy('venue.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    const [entities, total] = await qb.getManyAndCount();

    return VenueMapper.toResponseListDTO(entities, total, query);
  }

  public async getAllVenues(
    userData: IUserData,
    query: AdminVenueListQueryDto,
  ): Promise<VenueListResDto> {
    this.assertSuperAdmin(userData);

    const qb = this.venueRepository.createQueryBuilder('venue');

    qb.leftJoinAndSelect('venue.tags', 'tag');
    qb.leftJoinAndSelect('venue.user', 'user');
    qb.leftJoinAndSelect('venue.likes', 'like', 'like.user_id = :userId');
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :userId',
    );
    qb.setParameter('userId', userData.userId);

    if (typeof query.isModerated === 'boolean') {
      qb.andWhere('venue.isModerated = :isModerated', {
        isModerated: query.isModerated,
      });
    }

    if (typeof query.isActive === 'boolean') {
      qb.andWhere('venue.isActive = :isActive', { isActive: query.isActive });
    }

    if (query.search) {
      qb.andWhere('CONCAT(venue.name, venue.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }

    qb.orderBy('venue.created', 'DESC');
    qb.take(query.limit ?? 10);
    qb.skip(query.offset ?? 0);

    const [entities, total] = await qb.getManyAndCount();

    return VenueMapper.toResponseListDTO(
      entities,
      total,

      {
        limit: query.limit ?? 10,
        offset: query.offset ?? 0,
        search: query.search,
        tag: query.tag,
      } as any,
    );
  }

  public async approveVenue(
    userData: IUserData,
    venueId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id', 'isModerated'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (!venue.isModerated) {
      await this.venueRepository.update(venueId, { isModerated: true });
    }
  }

  public async toggleVenueActive(
    userData: IUserData,
    venueId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id', 'isActive'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.venueRepository.update(venueId, { isActive: !venue.isActive });
  }

  public async updateVenue(
    userData: IUserData,
    venueId: string,
    dto: AdminUpdateVenueReqDto,
  ): Promise<VenueResDto> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      relations: ['tags', 'user', 'likes'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    let tagsEntities: TagEntity[] | undefined = undefined;
    if (dto.tags) {
      const names = Array.from(
        new Set(dto.tags.map((t) => t.trim()).filter(Boolean)),
      );
      tagsEntities = [];

      for (const name of names) {
        const existing = await this.tagRepository.findOne({ where: { name } });
        if (existing) {
          tagsEntities.push(existing);
        } else {
          const created = await this.tagRepository.save(
            this.tagRepository.create({ name }),
          );
          tagsEntities.push(created);
        }
      }
    }

    const { tags, ...plain } = dto;

    this.venueRepository.merge(venue, plain as any);

    if (tagsEntities) {
      venue.tags = tagsEntities;
    }

    const saved = await this.venueRepository.save(venue);

    const full = await this.venueRepository.findOne({
      where: { id: saved.id },
      relations: ['tags', 'user', 'likes'],
    });

    return VenueMapper.toResponseDTO(full);
  }

  public async deleteVenue(
    userData: IUserData,
    venueId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id'],
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.venueRepository.delete({ id: venueId });
  }

  public async getAllUsers(
    userData: IUserData,
    query: AdminUserListQueryDto,
  ): Promise<AdminUserListResDto> {
    this.assertSuperAdmin(userData);

    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    const [users, total] = await this.userRepository.getAdminList(
      limit,
      offset,
      query.search,
    );

    return {
      data: users.map((u) => UserMapper.toResponseDTO(u)),
      total,
      limit,
      offset,
    };
  }

  public async updateUser(
    userData: IUserData,
    userId: string,
    dto: AdminUpdateUserReqDto,
  ) {
    this.assertSuperAdmin(userData);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'name',
        'email',
        'bio',
        'image',
        'role',
        'created',
        'updated',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.role) {
      const roles = new Set(dto.role);
      roles.add(RoleUserEnum.USER);
      user.role = Array.from(roles);
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.image !== undefined) user.image = dto.image;

    const saved = await this.userRepository.save(user);
    return UserMapper.toResponseDTO(saved);
  }

  public async deleteUser(userData: IUserData, userId: string): Promise<void> {
    this.assertSuperAdmin(userData);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete({ id: userId });
  }

  public async reassignVenueOwner(
    userData: IUserData,
    venueId: string,
    newOwnerUserId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id', 'user_id'],
    });

    if (!venue) throw new NotFoundException('Venue not found');

    const newOwner = await this.userRepository.findOne({
      where: { id: newOwnerUserId },
      select: ['id'],
    });

    if (!newOwner) throw new NotFoundException('New owner user not found');

    await this.venueRepository.update(venueId, { user_id: newOwnerUserId });
  }

  public async updateComment(
    userData: IUserData,
    commentId: string,
    dto: AdminUpdateCommentReqDto,
  ): Promise<CommentResDto> {
    this.assertSuperAdmin(userData);

    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'], // потрібно для CommentMapper (isCritic)
    });

    if (!comment) throw new NotFoundException('Comment not found');

    // адмін може змінювати все без обмежень критика
    if (dto.title !== undefined) comment.title = dto.title;
    if (dto.body !== undefined) comment.body = dto.body;
    if (dto.rating !== undefined) comment.rating = dto.rating;
    if (dto.image_check !== undefined)
      comment.image_check = dto.image_check as any;

    // recommendation: дозволяємо адміну ставити/скидати
    if (dto.recommendation !== undefined) {
      comment.recommendation = dto.recommendation as any;
    }

    const saved = await this.commentRepository.save(comment);

    // підвантажимо user ще раз (інколи save може скинути relation)
    const full = await this.commentRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });

    return CommentMapper.toResponseDTO(userData, full);
  }

  public async deleteComment(
    userData: IUserData,
    commentId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const exists = await this.commentRepository.findOne({
      where: { id: commentId },
      select: ['id'],
    });

    if (!exists) throw new NotFoundException('Comment not found');

    await this.commentRepository.delete({ id: commentId });
  }

  public async setVenueRatingForUser(
    userData: IUserData,
    venueId: string,
    userId: string,
    rating: number,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.ratingVenueRepository.findOne({
      where: { user_id: userId, venue_id: venueId },
      select: ['id', 'user_id', 'venue_id', 'rating'],
    });

    if (existing) {
      existing.rating = rating;
      await this.ratingVenueRepository.save(existing);
      return;
    }

    await this.ratingVenueRepository.save(
      this.ratingVenueRepository.create({
        user_id: userId,
        venue_id: venueId,
        rating,
      } as RatingVenueEntity),
    );
  }

  public async removeVenueRatingForUser(
    userData: IUserData,
    venueId: string,
    userId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id'],
    });
    if (!user) throw new NotFoundException('User not found');

    await this.ratingVenueRepository.delete({
      user_id: userId,
      venue_id: venueId,
    });
  }

  public async getVenueViewsSummary(
    userData: IUserData,
    venueId: string,
    query: AdminVenueViewsQueryDto,
  ): Promise<AdminVenueViewsSummaryResDto> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    return await this.venueViewRepository.getViewsSummary(
      venueId,
      query.fromDate,
      query.toDate,
    );
  }

  public async getVenueViewsTimeSeries(
    userData: IUserData,
    venueId: string,
    query: AdminVenueViewsQueryDto,
  ): Promise<AdminVenueViewsTimePointResDto[]> {
    this.assertSuperAdmin(userData);

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    const bucket = query.bucket ?? 'day';

    const rows = await this.venueViewRepository.getViewsTimeSeries(
      venueId,
      bucket,
      query.fromDate,
      query.toDate,
    );

    return rows;
  }

  public async getComplaints(
    userData: IUserData,
    query: AdminComplaintListQueryDto,
  ): Promise<ComplaintListResDto> {
    this.assertSuperAdmin(userData);

    const [entities, total] = await this.complaintRepository.getAdminList(query);

    return ComplaintMapper.toListResponseDTO(
      entities,
      total,
      query.limit,
      query.offset,
    );
  }

  public async getComplaintById(
    userData: IUserData,
    complaintId: string,
  ): Promise<ComplaintResDto> {
    this.assertSuperAdmin(userData);

    const entity = await this.complaintRepository.findOne({
      where: { id: complaintId },
      relations: { user: true, venue: true },
    });
    if (!entity) throw new NotFoundException('Complaint not found');

    return ComplaintMapper.toResponseDTO(entity);
  }

  public async updateComplaintStatus(
    userData: IUserData,
    complaintId: string,
    dto: AdminUpdateComplaintStatusReqDto,
  ): Promise<ComplaintResDto> {
    this.assertSuperAdmin(userData);

    const entity = await this.complaintRepository.findOne({
      where: { id: complaintId },
      relations: { user: true, venue: true },
    });
    if (!entity) throw new NotFoundException('Complaint not found');

    entity.status = dto.status;
    const saved = await this.complaintRepository.save(entity);

    return ComplaintMapper.toResponseDTO(saved);
  }

  // TOP

  public async getTopCategories(userData: IUserData): Promise<TopCategoryResDto[]> {
    this.assertSuperAdmin(userData);

    const categories = await this.topRepository.categories.find({
      order: { order: 'ASC', created: 'DESC' },
    });
    return categories.map((c) => this.mapTopCategory(c));
  }

  public async createTopCategory(
    userData: IUserData,
    dto: AdminCreateTopCategoryReqDto,
  ): Promise<TopCategoryResDto> {
    this.assertSuperAdmin(userData);

    const slug = (dto.slug?.trim() || this.slugify(dto.title)).toLowerCase();
    const entity = this.topRepository.categories.create({
      title: dto.title.trim(),
      slug,
      isActive: dto.isActive ?? true,
      order: dto.order ?? 0,
    });
    const saved = await this.topRepository.categories.save(entity);
    return this.mapTopCategory(saved);
  }

  public async updateTopCategory(
    userData: IUserData,
    categoryId: string,
    dto: AdminUpdateTopCategoryReqDto,
  ): Promise<TopCategoryResDto> {
    this.assertSuperAdmin(userData);

    const entity = await this.topRepository.getCategoryById(categoryId);
    if (!entity) throw new NotFoundException('Top category not found');

    if (dto.title !== undefined) entity.title = dto.title.trim();
    if (dto.slug !== undefined) entity.slug = dto.slug.trim().toLowerCase();
    if (dto.isActive !== undefined) entity.isActive = dto.isActive;
    if (dto.order !== undefined) entity.order = dto.order;

    const saved = await this.topRepository.categories.save(entity);
    return this.mapTopCategory(saved);
  }

  public async deleteTopCategory(
    userData: IUserData,
    categoryId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const res = await this.topRepository.categories.delete({ id: categoryId });
    if (!res.affected) throw new NotFoundException('Top category not found');
  }

  public async reorderTopCategories(
    userData: IUserData,
    dto: AdminReorderTopCategoriesReqDto,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const ids = dto.items.map((i) => i.categoryId);
    const categories = await this.topRepository.categories.findBy({ id: In(ids) });
    const map = new Map(dto.items.map((i) => [i.categoryId, i.order]));
    for (const c of categories) {
      const order = map.get(c.id);
      if (order !== undefined) c.order = order;
    }
    await this.topRepository.categories.save(categories);
  }

  public async addVenueToTopCategory(
    userData: IUserData,
    categoryId: string,
    dto: AdminAddVenueToTopCategoryReqDto,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const category = await this.topRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundException('Top category not found');

    const venue = await this.venueRepository.findOne({ where: { id: dto.venueId } });
    if (!venue) throw new NotFoundException('Venue not found');

    const item = this.topRepository.items.create({
      category_id: category.id,
      venue_id: venue.id,
      order: dto.order ?? 0,
    });
    await this.topRepository.items.save(item);
  }

  public async removeVenueFromTopCategory(
    userData: IUserData,
    categoryId: string,
    venueId: string,
  ): Promise<void> {
    this.assertSuperAdmin(userData);
    await this.topRepository.items.delete({ category_id: categoryId, venue_id: venueId } as any);
  }

  public async reorderTopCategoryVenues(
    userData: IUserData,
    categoryId: string,
    dto: AdminReorderTopCategoryVenuesReqDto,
  ): Promise<void> {
    this.assertSuperAdmin(userData);

    const items = await this.topRepository.items.find({ where: { category_id: categoryId } as any });
    const map = new Map(dto.items.map((i) => [i.venueId, i.order]));
    for (const it of items) {
      const order = map.get(it.venue_id);
      if (order !== undefined) it.order = order;
    }
    await this.topRepository.items.save(items);
  }

  public async getTopCategoryWithVenues(
    userData: IUserData,
    categoryId: string,
  ): Promise<TopCategoryWithVenuesResDto> {
    this.assertSuperAdmin(userData);

    const category = await this.topRepository.getCategoryById(categoryId);
    if (!category) throw new NotFoundException('Top category not found');

    // For admin view, show venues even if inactive/unmoderated
    const qb = this.topRepository.items
      .createQueryBuilder('it')
      .innerJoinAndSelect('it.venue', 'venue')
      .leftJoinAndSelect('venue.tags', 'tag')
      .leftJoinAndSelect('venue.user', 'user')
      .where('it.category_id = :categoryId', { categoryId })
      .orderBy('it.order', 'ASC')
      .addOrderBy('venue.created', 'DESC');

    const rows = await qb.getMany();
    const venues = rows.map((r) => r.venue!).filter(Boolean);

    // attach rating aggregates for admin view (optional)
    // keep it simple: no aggregates here; frontend can call venue details if needed
    return {
      category: this.mapTopCategory(category),
      venues: venues.map((v) => VenueMapper.toResponseDTO(v)),
    };
  }

  private mapTopCategory(entity: TopCategoryEntity): TopCategoryResDto {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      isActive: entity.isActive,
      order: entity.order,
    };
  }

  private slugify(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
