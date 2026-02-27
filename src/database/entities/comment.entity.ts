import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { CommentRecommendationEnum } from './enums/comment-recommendation';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.COMMENTS)
export class CommentEntity extends CreateUpdateModel {
  @Column('text')
  body: string;

  @Column('text')
  title: string;

  @Column('text', { nullable: true })
  image_check?: string;

  @Column({ type: 'int', nullable: false })
  rating: number;

  @Column({
    type: 'enum',
    enum: CommentRecommendationEnum,
    nullable: true,
  })
  recommendation?: CommentRecommendationEnum | null;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.comments)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  venue_id: string;
  @ManyToOne(() => VenueEntity, (entity) => entity.comments)
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;
}
