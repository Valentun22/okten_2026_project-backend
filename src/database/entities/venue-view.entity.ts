import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.VENUE_VIEWS)
export class VenueViewEntity extends CreateUpdateModel {
  @Column()
  venue_id: string;

  @ManyToOne(() => VenueEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;

  @Column({ nullable: true })
  user_id?: string;

  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column('text', { nullable: true })
  ip?: string;

  @Column('text', { nullable: true })
  userAgent?: string;
}
