import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ComplaintEntity } from '../../../database/entities/complaint.entity';
import { ComplaintListQueryDto } from '../../venue/dto/req/complaint-list.query.dto';
import { AdminComplaintListQueryDto } from '../../admin/dto/req/admin-complaint-list.query.dto';

@Injectable()
export class ComplaintRepository extends Repository<ComplaintEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ComplaintEntity, dataSource.manager);
  }

  public async getListForVenue(
    venueId: string,
    query: ComplaintListQueryDto,
  ): Promise<[ComplaintEntity[], number]> {
    const qb = this.createQueryBuilder('complaint');

    qb.leftJoinAndSelect('complaint.user', 'user');
    qb.leftJoinAndSelect('complaint.venue', 'venue');

    qb.where('complaint.venue_id = :venueId', { venueId });

    if (query.status) {
      qb.andWhere('complaint.status = :status', { status: query.status });
    }
    if (query.type) {
      qb.andWhere('complaint.type = :type', { type: query.type });
    }
    if (query.fromDate) {
      qb.andWhere('complaint.created >= :from', { from: query.fromDate });
    }
    if (query.toDate) {
      qb.andWhere('complaint.created <= :to', { to: query.toDate });
    }

    qb.orderBy('complaint.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getAdminList(
    query: AdminComplaintListQueryDto,
  ): Promise<[ComplaintEntity[], number]> {
    const qb = this.createQueryBuilder('complaint');

    qb.leftJoinAndSelect('complaint.user', 'user');
    qb.leftJoinAndSelect('complaint.venue', 'venue');

    if (query.venueId) {
      qb.andWhere('complaint.venue_id = :venueId', { venueId: query.venueId });
    }
    if (query.userId) {
      qb.andWhere('complaint.user_id = :userId', { userId: query.userId });
    }
    if (query.status) {
      qb.andWhere('complaint.status = :status', { status: query.status });
    }
    if (query.type) {
      qb.andWhere('complaint.type = :type', { type: query.type });
    }
    if (query.fromDate) {
      qb.andWhere('complaint.created >= :from', { from: query.fromDate });
    }
    if (query.toDate) {
      qb.andWhere('complaint.created <= :to', { to: query.toDate });
    }

    qb.orderBy('complaint.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }
}
