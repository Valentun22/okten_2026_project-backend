import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { VenueViewEntity } from '../../../database/entities/venue-view.entity';

@Injectable()
export class VenueViewRepository extends Repository<VenueViewEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(VenueViewEntity, dataSource.manager);
  }

  public async logView(params: {
    venueId: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
  }): Promise<void> {
    await this.save(
      this.create({
        venue_id: params.venueId,
        user_id: params.userId ?? null,
        ip: params.ip ?? null,
        userAgent: params.userAgent ?? null,
      }),
    );
  }

  public async getViewsSummary(
    venueId: string,
    from?: Date,
    to?: Date,
  ): Promise<{ total: number; uniqueUsers: number; uniqueIps: number }> {
    const qb = this.createQueryBuilder('vv').where('vv.venue_id = :venueId', {
      venueId,
    });

    if (from) qb.andWhere('vv.created >= :from', { from });
    if (to) qb.andWhere('vv.created <= :to', { to });

    const total = await qb.getCount();

    const uniqueUsersRow = await qb
      .clone()
      .select('COUNT(DISTINCT vv.user_id)', 'cnt')
      .getRawOne<{ cnt: string }>();

    const uniqueIpsRow = await qb
      .clone()
      .select('COUNT(DISTINCT vv.ip)', 'cnt')
      .getRawOne<{ cnt: string }>();

    return {
      total,
      uniqueUsers: Number(uniqueUsersRow?.cnt ?? 0),
      uniqueIps: Number(uniqueIpsRow?.cnt ?? 0),
    };
  }

  public async getViewsTimeSeries(
    venueId: string,
    bucket: 'hour' | 'day',
    from?: Date,
    to?: Date,
  ): Promise<Array<{ bucket: string; count: number }>> {
    const qb = this.createQueryBuilder('vv')
      .select(`date_trunc('${bucket}', vv.created)`, 'bucket')
      .addSelect('COUNT(*)', 'count')
      .where('vv.venue_id = :venueId', { venueId });

    if (from) qb.andWhere('vv.created >= :from', { from });
    if (to) qb.andWhere('vv.created <= :to', { to });

    qb.groupBy('bucket').orderBy('bucket', 'ASC');

    const rows = await qb.getRawMany<{ bucket: string; count: string }>();
    return rows.map((r) => ({ bucket: r.bucket, count: Number(r.count) }));
  }
}
