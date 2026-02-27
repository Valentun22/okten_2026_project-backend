import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { NewsTypeEnum } from '../../../database/entities/enums/news-type.enum';
import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { NewsEntity } from '../../../database/entities/news.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { NewsRepository } from '../../repository/services/news.repository';
import { VenueRepository } from '../../repository/services/venue.repository';
import { CreateNewsReqDto } from '../dto/req/create-news.req.dto';
import { NewsListQueryDto } from '../dto/req/news-list.query.dto';
import { UpdateNewsReqDto } from '../dto/req/update-news.req.dto';
import { NewsListResDto } from '../dto/res/news-list.res.dto';
import { NewsMapper } from './news.mapper';

@Injectable()
export class NewsService {
  constructor(
    private readonly newsRepository: NewsRepository,
    private readonly venueRepository: VenueRepository,
  ) {}

  public async create(
    userData: IUserData,
    venueId: string,
    dto: CreateNewsReqDto,
  ): Promise<NewsEntity> {
    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) throw new NotFoundException('Venue not found');

    const roles = userData.roles ?? [];

    const isSuperAdmin = roles.includes(RoleUserEnum.SUPERADMIN);

    if (!isSuperAdmin && venue.user_id !== userData.userId) {
      throw new ForbiddenException('You can create news only for your venue');
    }

    const isVenueAdmin = roles.includes(RoleUserEnum.VENUE_ADMIN);
    if (!isSuperAdmin && !isVenueAdmin) {
      throw new ForbiddenException('Only venue admin can create news');
    }

    const entity = this.newsRepository.create({
      title: dto.title,
      body: dto.body,
      type: dto.type ?? NewsTypeEnum.GENERAL,
      avatarNews: dto.avatarNews,
      images: dto.images,
      isActive: true,
      venue_id: venueId,
    });

    return await this.newsRepository.save(entity);
  }

  private canManageNews(userData: IUserData, ownerUserId: string): boolean {
    const isSuperAdmin = userData.roles?.includes(RoleUserEnum.SUPERADMIN);
    if (isSuperAdmin) return true;

    const isVenueAdmin = userData.roles?.includes(RoleUserEnum.VENUE_ADMIN);
    return !!isVenueAdmin && userData.userId === ownerUserId;
  }

  public async update(
    userData: IUserData,
    newsId: string,
    dto: UpdateNewsReqDto,
  ): Promise<NewsEntity> {
    const news = await this.newsRepository.findByIdWithVenueOwner(newsId);
    if (!news) throw new NotFoundException('News not found');

    const ownerUserId = news.venue?.user_id;
    if (!ownerUserId || !this.canManageNews(userData, ownerUserId)) {
      throw new ForbiddenException('You cannot update this news');
    }

    Object.assign(news, dto);
    return await this.newsRepository.save(news);
  }

  public async updateActive(
    userData: IUserData,
    newsId: string,
    isActive: boolean,
  ): Promise<NewsEntity> {
    const news = await this.newsRepository.findByIdWithVenueOwner(newsId);
    if (!news) throw new NotFoundException('News not found');

    const ownerUserId = news.venue?.user_id;
    if (!ownerUserId || !this.canManageNews(userData, ownerUserId)) {
      throw new ForbiddenException(
        'You cannot change active status for this news',
      );
    }

    news.isActive = isActive;
    return await this.newsRepository.save(news);
  }

  public async delete(userData: IUserData, newsId: string): Promise<void> {
    const news = await this.newsRepository.findByIdWithVenueOwner(newsId);
    if (!news) throw new NotFoundException('News not found');

    const ownerUserId = news.venue?.user_id;
    if (!ownerUserId || !this.canManageNews(userData, ownerUserId)) {
      throw new ForbiddenException('You cannot delete this news');
    }

    await this.newsRepository.remove(news);
  }

  public async getVenueManageList(
    userData: IUserData,
    venueId: string,
    query: NewsListQueryDto,
  ): Promise<NewsListResDto> {
    const venue = await this.venueRepository.findOneBy({ id: venueId });
    if (!venue) throw new NotFoundException('Venue not found');

    const ownerUserId = venue.user_id;
    if (!this.canManageNews(userData, ownerUserId)) {
      throw new ForbiddenException('You cannot manage news for this venue');
    }

    const [entities, total] = await this.newsRepository.getVenueManageList(
      venueId,
      query,
    );

    return NewsMapper.toListDTO(entities, total, query);
  }

  public async getGlobalList(query: NewsListQueryDto): Promise<NewsListResDto> {
    const [entities, total] = await this.newsRepository.getGlobalList(query);
    return NewsMapper.toListDTO(entities, total, query);
  }

  public async getVenueList(
    venueId: string,
    query: NewsListQueryDto,
  ): Promise<NewsListResDto> {
    const [entities, total] = await this.newsRepository.getVenueList(
      venueId,
      query,
    );
    return NewsMapper.toListDTO(entities, total, query);
  }
}
