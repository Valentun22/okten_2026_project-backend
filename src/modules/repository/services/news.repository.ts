import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { NewsEntity } from '../../../database/entities/news.entity';
import { NewsListQueryDto } from '../../news/dto/req/news-list.query.dto';

@Injectable()
export class NewsRepository extends Repository<NewsEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(NewsEntity, dataSource.manager);
  }

  public async getVenueManageList(
    venueId: string,
    query: NewsListQueryDto,
  ): Promise<[NewsEntity[], number]> {
    const qb = this.createQueryBuilder('news');

    qb.leftJoinAndSelect('news.venue', 'venue');

    qb.andWhere('news.venue_id = :venueId', { venueId });

    if (query.type) {
      qb.andWhere('news.type = :type', { type: query.type });
    }

    qb.orderBy('news.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async findByIdWithVenueOwner(
    newsId: string,
  ): Promise<NewsEntity | null> {
    return await this.createQueryBuilder('news')
      .leftJoinAndSelect('news.venue', 'venue')
      .where('news.id = :newsId', { newsId })
      .getOne();
  }

  public async getGlobalList(
    query: NewsListQueryDto,
  ): Promise<[NewsEntity[], number]> {
    const qb = this.createQueryBuilder('news');

    qb.leftJoinAndSelect('news.venue', 'venue');

    qb.andWhere('news.isActive = :isActive', { isActive: true });

    if (query.type) {
      qb.andWhere('news.type = :type', { type: query.type });
    }

    qb.orderBy('news.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getVenueList(
    venueId: string,
    query: NewsListQueryDto,
  ): Promise<[NewsEntity[], number]> {
    const qb = this.createQueryBuilder('news');

    qb.leftJoinAndSelect('news.venue', 'venue');

    qb.andWhere('news.isActive = :isActive', { isActive: true });
    qb.andWhere('news.venue_id = :venueId', { venueId });

    if (query.type) {
      qb.andWhere('news.type = :type', { type: query.type });
    }

    qb.orderBy('news.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }
}
