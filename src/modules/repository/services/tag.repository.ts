import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TagEntity } from '../../../database/entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(TagEntity, dataSource.manager);
  }

  public async getPopular(): Promise<TagEntity[]> {
    const qb = this.createQueryBuilder('tag');
    qb.leftJoin('tag.venues', 'venue');
    qb.addSelect('COUNT(venue.id)', 'tag_venueCount');
    qb.groupBy('tag.id');
    qb.orderBy('"tag_venueCount"', 'DESC');
    qb.limit(10);

    return await qb.getMany();
  }
}
