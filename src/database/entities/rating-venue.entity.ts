import { Check, Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Unique(['user_id', 'venue_id'])
@Check(`"rating" >= 1 AND "rating" <= 10`)
@Entity(TableNameEnum.RATING_VENUE)
export class RatingVenueEntity extends CreateUpdateModel {
  @Column({ type: 'int' })
  rating: number;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.rating)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  venue_id: string;
  @ManyToOne(() => VenueEntity, (entity) => entity.rating)
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;
}
