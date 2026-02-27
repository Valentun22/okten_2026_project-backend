import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { RatingVenueEntity } from '../../../database/entities/rating-venue.entity';
import { VenueEntity } from '../../../database/entities/venue.entity';
import {
  SortOrderEnum,
  VenueListQueryDto,
  VenueSortByEnum,
} from '../../venue/dto/req/venue-list.query.dto';

@Injectable()
export class VenueRepository extends Repository<VenueEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(VenueEntity, dataSource.manager);
  }

  public async getList(
    userId: string | undefined,
    query: VenueListQueryDto,
    roles: RoleUserEnum[] = [],
  ): Promise<[VenueEntity[], number]> {
    const qb = this.createQueryBuilder('venue');

    const isPrivileged = roles.includes(RoleUserEnum.SUPERADMIN);

    // Public list shows only moderated + active venues
    if (!isPrivileged) {
      qb.andWhere('venue.isModerated = true');
      qb.andWhere('venue.isActive = true');
    }

    qb.leftJoinAndSelect('venue.tags', 'tag');
    qb.leftJoinAndSelect('venue.user', 'user');

    // Optional joins for authenticated user
    if (userId) {
      qb.leftJoinAndSelect('venue.likes', 'like', 'like.user_id = :userId');
      qb.leftJoinAndSelect(
        'user.followings',
        'following',
        'following.follower_id = :userId',
      );
      qb.setParameter('userId', userId);
    }

    // Rating aggregates (virtual fields)
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

    if (query.search) {
      qb.andWhere('CONCAT(venue.name, venue.description) ILIKE :search');
      qb.setParameter('search', `%${query.search}%`);
    }

    if (query.tag) {
      qb.andWhere('tag.name = :tag');
      qb.setParameter('tag', query.tag);
    }

    if (query.categories?.length) {
      // overlap for Postgres enum arrays
      qb.andWhere('venue.categories && :categories');
      qb.setParameter('categories', query.categories);
    }

    if (typeof query.averageCheckFrom === 'number') {
      qb.andWhere('venue.averageCheck >= :avgFrom');
      qb.setParameter('avgFrom', query.averageCheckFrom);
    }

    if (typeof query.averageCheckTo === 'number') {
      qb.andWhere('venue.averageCheck <= :avgTo');
      qb.setParameter('avgTo', query.averageCheckTo);
    }

    if (typeof query.ratingFrom === 'number') {
      qb.andWhere(`(${ratingAvgSub}) >= :ratingFrom`);
      qb.setParameter('ratingFrom', query.ratingFrom);
    }

    if (typeof query.ratingTo === 'number') {
      qb.andWhere(`(${ratingAvgSub}) <= :ratingTo`);
      qb.setParameter('ratingTo', query.ratingTo);
    }

    // Feature filters (apply only when true)
    const boolFilters: Array<[keyof VenueListQueryDto, string]> = [
      ['hasWiFi', 'venue.hasWiFi'],
      ['hasParking', 'venue.hasParking'],
      ['liveMusic', 'venue.liveMusic'],
      ['petFriendly', 'venue.petFriendly'],
      ['hasTerrace', 'venue.hasTerrace'],
      ['smokingAllowed', 'venue.smokingAllowed'],
      ['cardPayment', 'venue.cardPayment'],
    ];

    for (const [key, column] of boolFilters) {
      const v = (query as any)[key];
      if (v === true) qb.andWhere(`${column} = true`);
    }

    // Sorting
    const order = (query.sortOrder ?? SortOrderEnum.DESC) as any;
    switch (query.sortBy) {
      case VenueSortByEnum.RATING:
        qb.orderBy('ratingAvg', order);
        break;
      case VenueSortByEnum.AVERAGE_CHECK:
        qb.orderBy('venue.averageCheck', order);
        break;
      case VenueSortByEnum.NAME:
        qb.orderBy('venue.name', order);
        break;
      case VenueSortByEnum.CREATED:
      default:
        qb.orderBy('venue.created', order);
        break;
    }

    // Total count (without pagination) - build a lightweight query to avoid duplicates from joins
    const qbCount = this.createQueryBuilder('venue');
    if (!isPrivileged) {
      qbCount.andWhere('venue.isModerated = true');
      qbCount.andWhere('venue.isActive = true');
    }
    if (query.search) {
      qbCount.andWhere('CONCAT(venue.name, venue.description) ILIKE :search');
      qbCount.setParameter('search', `%${query.search}%`);
    }
    if (query.tag) {
      qbCount.leftJoin('venue.tags', 'tag');
      qbCount.andWhere('tag.name = :tag');
      qbCount.setParameter('tag', query.tag);
    }
    if (query.categories?.length) {
      qbCount.andWhere('venue.categories && :categories');
      qbCount.setParameter('categories', query.categories);
    }
    if (typeof query.averageCheckFrom === 'number') {
      qbCount.andWhere('venue.averageCheck >= :avgFrom');
      qbCount.setParameter('avgFrom', query.averageCheckFrom);
    }
    if (typeof query.averageCheckTo === 'number') {
      qbCount.andWhere('venue.averageCheck <= :avgTo');
      qbCount.setParameter('avgTo', query.averageCheckTo);
    }
    if (typeof query.ratingFrom === 'number') {
      const ratingAvgSubCount = qbCount
        .subQuery()
        .select('COALESCE(AVG(rv.rating), 0)')
        .from(RatingVenueEntity, 'rv')
        .where('rv.venue_id = venue.id')
        .getQuery();
      qbCount.andWhere(`(${ratingAvgSubCount}) >= :ratingFrom`);
      qbCount.setParameter('ratingFrom', query.ratingFrom);
    }
    if (typeof query.ratingTo === 'number') {
      const ratingAvgSubCount = qbCount
        .subQuery()
        .select('COALESCE(AVG(rv.rating), 0)')
        .from(RatingVenueEntity, 'rv')
        .where('rv.venue_id = venue.id')
        .getQuery();
      qbCount.andWhere(`(${ratingAvgSubCount}) <= :ratingTo`);
      qbCount.setParameter('ratingTo', query.ratingTo);
    }
    for (const [key, column] of [
      ['hasWiFi', 'venue.hasWiFi'],
      ['hasParking', 'venue.hasParking'],
      ['liveMusic', 'venue.liveMusic'],
      ['petFriendly', 'venue.petFriendly'],
      ['hasTerrace', 'venue.hasTerrace'],
      ['smokingAllowed', 'venue.smokingAllowed'],
      ['cardPayment', 'venue.cardPayment'],
    ] as Array<[string, string]>) {
      const v = (query as any)[key];
      if (v === true) qbCount.andWhere(`${column} = true`);
    }
    qbCount.select('venue.id').distinct(true);
    const total = await qbCount.getCount();

    qb.take(query.limit);
    qb.skip(query.offset);

    const { entities, raw } = await qb.getRawAndEntities();
    // Attach virtual fields to entities
    entities.forEach((e, idx) => {
      (e as any).ratingAvg = raw[idx]?.ratingAvg
        ? Number(raw[idx].ratingAvg)
        : 0;
      (e as any).ratingCount = raw[idx]?.ratingCount
        ? Number(raw[idx].ratingCount)
        : 0;
    });

    return [entities, total];
  }

  public async getById(
    userId: string | undefined,
    venueId: string,
    em?: EntityManager,
  ): Promise<VenueEntity> {
    const repo = em ? em.getRepository(VenueEntity) : this;
    const qb = repo.createQueryBuilder('venue');

    qb.leftJoinAndSelect('venue.tags', 'tag');
    qb.leftJoinAndSelect('venue.user', 'user');

    if (userId) {
      qb.leftJoinAndSelect('venue.likes', 'like', 'like.user_id = :userId');
      qb.leftJoinAndSelect(
        'user.followings',
        'following',
        'following.follower_id = :userId',
      );
      qb.setParameter('userId', userId);
    }

    qb.andWhere('venue.id = :venueId', { venueId });

    const entity = await qb.getOneOrFail();

    // Attach rating aggregates (virtual fields)
    const ratingRepo = em
      ? em.getRepository(RatingVenueEntity)
      : this.dataSource.getRepository(RatingVenueEntity);

    const { ratingAvg, ratingCount } = (await ratingRepo
      .createQueryBuilder('rv')
      .select('COALESCE(AVG(rv.rating), 0)', 'ratingAvg')
      .addSelect('COUNT(rv.id)', 'ratingCount')
      .where('rv.venue_id = :venueId', { venueId })
      .getRawOne()) as { ratingAvg: string; ratingCount: string };

    (entity as any).ratingAvg = ratingAvg ? Number(ratingAvg) : 0;
    (entity as any).ratingCount = ratingCount ? Number(ratingCount) : 0;

    return entity;
  }
}
