import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from '../../../database/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(UserEntity, dataSource.manager);
  }

  public async findUserWithLikes(id: string): Promise<UserEntity> {
    return await this.findOneBy({ id });
  }

  public async getAdminList(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<[UserEntity[], number]> {
    const qb = this.createQueryBuilder('user');

    // важливо: password select:false, тому не підтягнеться
    qb.select([
      'user.id',
      'user.name',
      'user.email',
      'user.bio',
      'user.image',
      'user.role',
      'user.created',
      'user.updated',
    ]);

    if (search) {
      qb.andWhere('CONCAT(user.name, user.email) ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy('user.created', 'DESC');
    qb.take(limit);
    qb.skip(offset);

    return await qb.getManyAndCount();
  }
}
