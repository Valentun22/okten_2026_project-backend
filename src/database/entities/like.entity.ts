import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Unique(['user_id', 'venue_id'])
@Entity(TableNameEnum.LIKES)
export class LikeEntity extends CreateUpdateModel {
  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column()
  venue_id: string;
  @ManyToOne(() => VenueEntity, (entity) => entity.likes)
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;
}
