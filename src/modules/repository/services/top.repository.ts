import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RatingVenueEntity } from '../../../database/entities/rating-venue.entity';
import { TopCategoryEntity } from '../../../database/entities/top-category.entity';
import { TopCategoryVenueEntity } from '../../../database/entities/top-category-venue.entity';
import { VenueEntity } from '../../../database/entities/venue.entity';

@Injectable()
export class TopRepository {
  public readonly categories: Repository<TopCategoryEntity>;
  public readonly items: Repository<TopCategoryVenueEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.categories = dataSource.getRepository(TopCategoryEntity);
    this.items = dataSource.getRepository(TopCategoryVenueEntity);
  }

  public async getActiveCategories(): Promise<TopCategoryEntity[]> {
    return await this.categories.find({
      where: { isActive: true },
      order: { order: 'ASC', created: 'DESC' },
    });
  }

  public async getCategoryBySlug(
    slug: string,
  ): Promise<TopCategoryEntity | null> {
    return await this.categories.findOne({ where: { slug } });
  }

  public async getCategoryById(id: string): Promise<TopCategoryEntity | null> {
    return await this.categories.findOne({ where: { id } });
  }

  public async getCategoryVenuesPublic(
    categoryId: string,
  ): Promise<VenueEntity[]> {
    const qb = this.dataSource
      .getRepository(TopCategoryVenueEntity)
      .createQueryBuilder('it')
      .innerJoinAndSelect('it.venue', 'venue')
      .leftJoinAndSelect('venue.tags', 'tag')
      .leftJoinAndSelect('venue.user', 'user')
      .where('it.category_id = :categoryId', { categoryId })
      .andWhere('venue.isModerated = true')
      .andWhere('venue.isActive = true')
      .orderBy('it.order', 'ASC')
      .addOrderBy('venue.created', 'DESC');

    const ratingAvgSub = qb
      .subQuery()
      .select('COALESCE(AVG(rv.rating), 0)')
      .from(RatingVenueEntity, 'rv')
      .where('rv.venue_id = venue.id')
      .getQuery();

    const ratingCountSub = qb
      .subQuery()
      .select('COUNT(rv2.id)')
      .from(RatingVenueEntity, 'rv2')
      .where('rv2.venue_id = venue.id')
      .getQuery();

    qb.addSelect(`(${ratingAvgSub})`, 'ratingAvg');
    qb.addSelect(`(${ratingCountSub})`, 'ratingCount');

    const rows = await qb.getRawAndEntities();

    // rows.entities -> TopCategoryVenueEntity[]
    return rows.entities.map((item, idx) => {
      const raw = rows.raw[idx];

      const venue = item.venue;
      (venue as any).ratingAvg = Number(raw?.ratingAvg ?? 0);
      (venue as any).ratingCount = Number(raw?.ratingCount ?? 0);

      return venue;
    });
  }
}
