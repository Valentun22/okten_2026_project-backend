import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CommentEntity } from '../../../database/entities/comment.entity';
import { CommentListQueryDto } from '../../comments/dto/req/comment-list.query.dto';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(CommentEntity, dataSource.manager);
  }

  public async getListByVenue(
    currentUserId: string,
    venueId: string,
    query: CommentListQueryDto,
  ): Promise<[CommentEntity[], number]> {
    const qb = this.createQueryBuilder('comment');

    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :currentUserId',
    );
    qb.setParameter('currentUserId', currentUserId);

    qb.andWhere('comment.venue_id = :venueId', { venueId });

    qb.orderBy('comment.created', 'DESC');
    qb.take(query.limit);
    qb.skip(query.offset);

    return await qb.getManyAndCount();
  }

  public async getByIdOrFail(
    currentUserId: string,
    commentId: string,
  ): Promise<CommentEntity> {
    const qb = this.createQueryBuilder('comment');

    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect(
      'user.followings',
      'following',
      'following.follower_id = :currentUserId',
    );
    qb.setParameter('currentUserId', currentUserId);

    qb.andWhere('comment.id = :commentId', { commentId });

    return await qb.getOneOrFail();
  }

  public async findMyComments(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<[CommentEntity[], number]> {
    const qb = this.createQueryBuilder('comment');

    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect('comment.venue', 'venue');

    qb.where('comment.user_id = :userId', { userId });
    qb.orderBy('comment.created', 'DESC');

    qb.take(limit);
    qb.skip(offset);

    return await qb.getManyAndCount();
  }

  public async getAllComments(
    limit: number,
    offset: number,
    search?: string,
  ): Promise<[any[], number]> {
    const qb = this.createQueryBuilder('comment');
    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect('comment.venue', 'venue');

    if (search) {
      qb.andWhere(
        '(comment.title ILIKE :s OR comment.body ILIKE :s OR venue.name ILIKE :s OR user.name ILIKE :s)',
        { s: `%${search}%` },
      );
    }

    qb.orderBy('comment.created', 'DESC');
    qb.take(limit);
    qb.skip(offset);

    return await qb.getManyAndCount();
  }
}
