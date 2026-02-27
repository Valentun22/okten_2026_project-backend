import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { RatingVenueEntity } from '../../../database/entities/rating-venue.entity';

@Injectable()
export class RatingVenueRepository extends Repository<RatingVenueEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(RatingVenueEntity, dataSource.manager);
  }

  public async findMyRatedVenues(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[RatingVenueEntity[], number]> {
    const qb = this.createQueryBuilder('rv');

    qb.leftJoinAndSelect('rv.venue', 'venue');
    qb.leftJoinAndSelect('venue.tags', 'tag');
    qb.leftJoinAndSelect('venue.user', 'user');

    qb.leftJoinAndSelect('venue.likes', 'like', 'like.user_id = :userId', {
      userId,
    });

    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :userId',
      { userId },
    );

    qb.where('rv.user_id = :userId', { userId });
    qb.orderBy('rv.created', 'DESC');

    qb.take(limit);
    qb.skip(offset);

    return await qb.getManyAndCount();
  }
}
