import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PyachokEntity } from '../../../database/entities/pyachok.entity';
import { PyachokListQueryDto } from '../../pyachok/dto/req/pyachok-list.query.dto';
import { PyachokStatusEnum } from '../../pyachok/enums/pyachok-status.enum';

@Injectable()
export class PyachokRepository extends Repository<PyachokEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(PyachokEntity, dataSource.manager);
  }
  public async getVenuePublicList(
    venueId: string,
    query: PyachokListQueryDto,
  ): Promise<[PyachokEntity[], number]> {
    const qb = this.createQueryBuilder('p');

    qb.andWhere('p.venue_id = :venueId', { venueId });
    qb.andWhere('p.status = :status', { status: PyachokStatusEnum.OPEN });

    if (query.date) {
      qb.andWhere('p.date = :date', { date: query.date });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    qb.take(limit);
    qb.skip(skip);

    qb.orderBy('p.created', 'DESC');

    return await qb.getManyAndCount();
  }

  public async getVenueManageList(
    venueId: string,
    query: PyachokListQueryDto,
  ): Promise<[PyachokEntity[], number]> {
    const qb = this.createQueryBuilder('p');

    qb.leftJoinAndSelect('p.user', 'user');
    qb.andWhere('p.venue_id = :venueId', { venueId });

    if (query.status === PyachokStatusEnum.OPEN) {
      qb.andWhere('p.status = :status', { status: PyachokStatusEnum.OPEN });
    }

    if (query.status === PyachokStatusEnum.CLOSED) {
      qb.andWhere('p.status = :status', { status: PyachokStatusEnum.CLOSED });
    }

    if (query.date) {
      qb.andWhere('p.date = :date', { date: query.date });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    qb.take(limit);
    qb.skip(skip);

    qb.orderBy('p.created', 'DESC');

    return await qb.getManyAndCount();
  }

  public async getOpenFeed(
    query: PyachokListQueryDto,
  ): Promise<[PyachokEntity[], number]> {
    const qb = this.createQueryBuilder('p');
    qb.leftJoinAndSelect('p.user', 'user');
    qb.leftJoinAndSelect('p.venue', 'venue');
    qb.andWhere('p.status = :status', { status: PyachokStatusEnum.OPEN });

    if (query.date) {
      qb.andWhere('p.date = :date', { date: query.date });
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    qb.take(limit);
    qb.skip(skip);
    qb.orderBy('p.created', 'DESC');

    return await qb.getManyAndCount();
  }
}
