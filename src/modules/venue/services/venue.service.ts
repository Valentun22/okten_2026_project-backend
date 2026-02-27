import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';

import { ComplaintEntity } from '../../../database/entities/complaint.entity';
import { RatingVenueEntity } from '../../../database/entities/rating-venue.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import { VenueEntity } from '../../../database/entities/venue.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { EmailService } from '../../email/services/email.service';
import { LikeRepository } from '../../repository/services/like.repository';
import { ComplaintRepository } from '../../repository/services/complaint.repository';
import { VenueRepository } from '../../repository/services/venue.repository';
import { VenueViewRepository } from '../../repository/services/venue-view.repository';
import { ComplaintListQueryDto } from '../dto/req/complaint-list.query.dto';
import { CreateComplaintReqDto } from '../dto/req/create-complaint.req.dto';
import { CreateVenueReqDto } from '../dto/req/create-venue.req.dto';
import { UpdateVenueReqDto } from '../dto/req/update-venue.req.dto';
import { VenueListQueryDto } from '../dto/req/venue-list.query.dto';
import { VenueViewsQueryDto } from '../dto/req/venue-views.query.dto';
import { ComplaintListResDto } from '../dto/res/complaint-list.res.dto';
import { ComplaintResDto } from '../dto/res/complaint.res.dto';
import {
  VenueViewsSummaryResDto,
  VenueViewsTimePointResDto,
} from '../dto/res/venue-views.res.dto';
import { ComplaintMapper } from './complaint.mapper';

@Injectable()
export class VenueService {
  constructor(
    private readonly venueRepository: VenueRepository,
    private readonly venueViewRepository: VenueViewRepository,
    private readonly likeRepository: LikeRepository,
    private readonly complaintRepository: ComplaintRepository,
    private readonly emailService: EmailService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private assertVenueAdminOrSuperAdmin(userData: IUserData): void {
    const roles = userData.roles ?? [];
    const isSuperAdmin = roles.includes(RoleUserEnum.SUPERADMIN);
    const isVenueAdmin = roles.includes(RoleUserEnum.VENUE_ADMIN);
    if (!isSuperAdmin && !isVenueAdmin) {
      throw new ForbiddenException(
        'Only venue admin can manage venues. Use POST /users/me/venue-admin to become one.',
      );
    }
  }

  private async assertCanAccessVenueAnalytics(
    userData: IUserData,
    venueId: string,
  ): Promise<void> {
    this.assertVenueAdminOrSuperAdmin(userData);

    const isSuperAdmin = (userData.roles ?? []).includes(RoleUserEnum.SUPERADMIN);
    if (isSuperAdmin) return;

    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id', 'user_id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    if (venue.user_id !== userData.userId) {
      throw new ForbiddenException('You can access analytics only for your venues');
    }
  }

  public async getList(
    userData: IUserData | undefined,
    query: VenueListQueryDto,
  ): Promise<[VenueEntity[], number]> {
    return await this.venueRepository.getList(
      userData?.userId,
      query,
      userData?.roles ?? [],
    );
  }

  public async create(
    userData: IUserData,
    dto: CreateVenueReqDto,
  ): Promise<VenueEntity> {
    this.assertVenueAdminOrSuperAdmin(userData);
    return await this.entityManager.transaction<VenueEntity>(
      'SERIALIZABLE',
      async (em) => {
        const venueRepo = em.getRepository(VenueEntity);

        const tags = await this.createTags(dto.tags, em);

        const venue = venueRepo.create({
          ...dto,
          user_id: userData.userId,
          tags,
        });

        return await venueRepo.save(venue);
      },
    );
  }

  public async getById(
    userData: IUserData | undefined,
    venueId: string,
  ): Promise<VenueEntity> {
    // Public can view only moderated+active venues
    const venue = await this.venueRepository.getById(userData?.userId, venueId);
    const isPrivileged = (userData?.roles ?? []).includes(RoleUserEnum.SUPERADMIN);
    if (!isPrivileged) {
      if (!venue.isModerated || !venue.isActive) {
        throw new NotFoundException('Venue not found');
      }
    }
    return venue;
  }

  public async update(
    userData: IUserData,
    venueId: string,
    dto: UpdateVenueReqDto,
  ): Promise<VenueEntity> {
    this.assertVenueAdminOrSuperAdmin(userData);
    return await this.entityManager.transaction<VenueEntity>(
      'SERIALIZABLE',
      async (em) => {
        const venueRepo = em.getRepository(VenueEntity);

        const venue = await venueRepo.findOne({
          where: { id: venueId },
          relations: ['tags'],
        });
        if (!venue) throw new NotFoundException('Venue not found');

        const isOwner = venue.user_id === userData.userId;
        const isPrivileged = (userData.roles ?? []).includes(
          RoleUserEnum.SUPERADMIN,
        );
        if (!isOwner && !isPrivileged) {
          throw new ForbiddenException('You are not allowed to edit this venue');
        }

        // Update tags if provided
        let tags = venue.tags ?? [];
        if (dto.tags) {
          tags = await this.createTags(dto.tags, em);
        }

        Object.assign(venue, dto);
        venue.tags = tags;

        // Any user edits require re-moderation
        if (!isPrivileged) {
          venue.isModerated = false;
          venue.isActive = false;
        }

        await venueRepo.save(venue);
        return await this.venueRepository.getById(userData.userId, venueId, em);
      },
    );
  }

  public async delete(userData: IUserData, venueId: string): Promise<void> {
    this.assertVenueAdminOrSuperAdmin(userData);
    await this.entityManager.transaction('SERIALIZABLE', async (em) => {
      const venueRepo = em.getRepository(VenueEntity);

      const venue = await venueRepo.findOne({
        where: { id: venueId },
        select: ['id', 'user_id', 'isActive'],
      });
      if (!venue) throw new NotFoundException('Venue not found');

      const isOwner = venue.user_id === userData.userId;
      const isPrivileged = (userData.roles ?? []).includes(RoleUserEnum.SUPERADMIN);

      if (!isOwner && !isPrivileged) {
        throw new ForbiddenException('You are not allowed to delete this venue');
      }

      // Soft delete: hide from public lists
      if (venue.isActive) {
        await venueRepo.update(venueId, { isActive: false });
      }
    });
  }

  public async contactManager(
    userData: IUserData,
    venueId: string,
    message: string,
  ): Promise<void> {
    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      relations: ['user'],
    });

    if (!venue || !venue.isActive || !venue.isModerated) {
      throw new NotFoundException('Venue not found');
    }

    const to = venue.email || venue.user?.email;
    if (!to) {
      // If venue has no email configured, silently accept (but still behave as a "stub")
      return;
    }

    const subject = `Message to venue manager: ${venue.name}`;
    const text = [
      `Venue: ${venue.name} (${venue.id})`,
      `From user: ${userData.email} (${userData.userId})`,
      '',
      message,
    ].join('\n');

    await this.emailService.sendMail(to, subject, text);
  }

  public async like(
    userData: IUserData,
    venueId: string,
  ): Promise<VenueEntity> {
    await this.checkIsVenueExistOrThrow(venueId);

    const like = await this.likeRepository.findOneBy({
      venue_id: venueId,
      user_id: userData.userId,
    });
    if (like) {
      throw new ConflictException('Venue liked');
    }
    await this.likeRepository.save(
      this.likeRepository.create({
        venue_id: venueId,
        user_id: userData.userId,
      }),
    );
    return await this.venueRepository.getById(userData.userId, venueId);
  }

  public async unlike(
    userData: IUserData,
    venueId: string,
  ): Promise<VenueEntity> {
    await this.checkIsVenueExistOrThrow(venueId);
    const like = await this.likeRepository.findOneBy({
      venue_id: venueId,
      user_id: userData.userId,
    });
    if (!like) {
      throw new ConflictException('Not liked yet');
    }
    await this.likeRepository.remove(like);
    return await this.venueRepository.getById(userData.userId, venueId);
  }

  private async checkIsVenueExistOrThrow(venueId: string): Promise<void> {
    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
  }

  private async createTags(
    tags: string[],
    em: EntityManager,
  ): Promise<TagEntity[]> {
    const tagRepository = em.getRepository(TagEntity);
    if (!tags || tags.length === 0) return [];

    const entities = await tagRepository.findBy({ name: In(tags) });
    const existingTags = entities.map((entity) => entity.name);
    const newTags = tags.filter((tag) => !existingTags.includes(tag));
    const newEntities = await tagRepository.save(
      newTags.map((tag) => tagRepository.create({ name: tag })),
    );
    return [...entities, ...newEntities];
  }

  public async addToFavorites(userId: string, venueId: string): Promise<void> {
    await this.entityManager.transaction(async (em) => {
      const userRepo = em.getRepository(UserEntity);
      const venueRepo = em.getRepository(VenueEntity);

      const venue = await venueRepo.findOne({
        where: { id: venueId },
        select: ['id'],
      });
      if (!venue) throw new NotFoundException('Venue not found');

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['favoriteVenues'],
      });

      const already = (user.favoriteVenues ?? []).some((v) => v.id === venueId);
      if (!already) {
        user.favoriteVenues = [...(user.favoriteVenues ?? []), venue];
        await userRepo.save(user);
      }
    });
  }

  public async removeFromFavorites(
    userId: string,
    venueId: string,
  ): Promise<void> {
    await this.entityManager.transaction(async (em) => {
      const userRepo = em.getRepository(UserEntity);

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['favoriteVenues'],
      });

      user.favoriteVenues = (user.favoriteVenues ?? []).filter(
        (v) => v.id !== venueId,
      );
      await userRepo.save(user);
    });
  }

  public async setRating(
    userId: string,
    venueId: string,
    rating: number,
  ): Promise<void> {
    await this.checkIsVenueExistOrThrow(venueId);

    await this.entityManager.transaction(async (em) => {
      const ratingRepo = em.getRepository(RatingVenueEntity);

      const existing = await ratingRepo.findOne({
        where: { user_id: userId, venue_id: venueId },
        select: ['id', 'rating', 'user_id', 'venue_id'],
      });

      if (existing) {
        existing.rating = rating;
        await ratingRepo.save(existing);
        return;
      }

      await ratingRepo.save(
        ratingRepo.create({
          user_id: userId,
          venue_id: venueId,
          rating,
        }),
      );
    });
  }

  public async removeRating(userId: string, venueId: string): Promise<void> {
    await this.checkIsVenueExistOrThrow(venueId);

    await this.entityManager.transaction(async (em) => {
      const ratingRepo = em.getRepository(RatingVenueEntity);

      await ratingRepo.delete({ user_id: userId, venue_id: venueId });
    });
  }

  public async logViewSafe(params: {
    venueId: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await this.venueViewRepository.logView(params);
    } catch {}
  }

  public async getVenueViewsSummary(
    userData: IUserData,
    venueId: string,
    query: VenueViewsQueryDto,
  ): Promise<VenueViewsSummaryResDto> {
    await this.assertCanAccessVenueAnalytics(userData, venueId);
    return await this.venueViewRepository.getViewsSummary(
      venueId,
      query.fromDate,
      query.toDate,
    );
  }

  public async getVenueViewsTimeSeries(
    userData: IUserData,
    venueId: string,
    query: VenueViewsQueryDto,
  ): Promise<VenueViewsTimePointResDto[]> {
    await this.assertCanAccessVenueAnalytics(userData, venueId);

    const bucket = query.bucket ?? 'day';
    return await this.venueViewRepository.getViewsTimeSeries(
      venueId,
      bucket,
      query.fromDate,
      query.toDate,
    );
  }

  public async createComplaint(
    userData: IUserData,
    venueId: string,
    dto: CreateComplaintReqDto,
  ): Promise<ComplaintResDto> {
    await this.checkIsVenueExistOrThrow(venueId);

    const entity = this.complaintRepository.create({
      venue_id: venueId,
      user_id: userData.userId,
      type: dto.type,
      targetId: dto.targetId,
      reason: dto.reason,
    } as Partial<ComplaintEntity>);

    const saved = await this.complaintRepository.save(entity);
    const full = await this.complaintRepository.findOne({
      where: { id: saved.id },
      relations: { user: true, venue: true },
    });

    return ComplaintMapper.toResponseDTO(full ?? saved);
  }

  public async getComplaintsForVenue(
    userData: IUserData,
    venueId: string,
    query: ComplaintListQueryDto,
  ): Promise<ComplaintListResDto> {
    this.assertVenueAdminOrSuperAdmin(userData);

    const isSuperAdmin = (userData.roles ?? []).includes(RoleUserEnum.SUPERADMIN);
    const venue = await this.venueRepository.findOne({
      where: { id: venueId },
      select: ['id', 'user_id'],
    });
    if (!venue) throw new NotFoundException('Venue not found');

    if (!isSuperAdmin && venue.user_id !== userData.userId) {
      throw new ForbiddenException('You can access complaints only for your venues');
    }

    const [entities, total] = await this.complaintRepository.getListForVenue(
      venueId,
      query,
    );

    return ComplaintMapper.toListResponseDTO(
      entities,
      total,
      query.limit,
      query.offset,
    );
  }
}
