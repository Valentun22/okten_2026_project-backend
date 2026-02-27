import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { ComplaintStatusEnum } from './enums/complaint-status.enum';
import { ComplaintTypeEnum } from './enums/complaint-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.COMPLAINTS)
export class ComplaintEntity extends CreateUpdateModel {
  @Index()
  @Column('uuid')
  venue_id: string;

  @ManyToOne(() => VenueEntity, (entity) => entity.complaints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;

  @Index()
  @Column('uuid')
  user_id: string;

  @ManyToOne(() => UserEntity, (entity) => entity.complaints, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Index()
  @Column({
    type: 'enum',
    enum: ComplaintTypeEnum,
    default: ComplaintTypeEnum.VENUE,
  })
  type: ComplaintTypeEnum;

  // If complaint is related to a specific entity (news/comment), store its id here.
  @Column('text', { nullable: true })
  targetId?: string;

  @Column('text')
  reason: string;

  @Index()
  @Column({
    type: 'enum',
    enum: ComplaintStatusEnum,
    default: ComplaintStatusEnum.NEW,
  })
  status: ComplaintStatusEnum;
}
