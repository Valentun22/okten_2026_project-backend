import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PyachokStatusEnum } from '../../modules/pyachok/enums/pyachok-status.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { UserEntity } from './user.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.PYACHOK_REQUESTS)
export class PyachokEntity extends CreateUpdateModel {
  @Column('date')
  date: string;

  @Column('time')
  time: string;

  @Column('text', { nullable: true })
  purpose?: string;

  @Column('int', { nullable: true })
  peopleCount?: number;

  @Column('text', { nullable: true })
  genderPreference?: string;

  @Column('text', { nullable: true })
  payer?: string;

  @Column('int', { nullable: true })
  expectedBudget?: number;

  @Column({
    type: 'enum',
    enum: PyachokStatusEnum,
    default: PyachokStatusEnum.OPEN,
  })
  status: PyachokStatusEnum;

  @Column('uuid')
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.pyachok)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('text', { nullable: true })
  message?: string;

  @Column('uuid')
  venue_id: string;
  @ManyToOne(() => VenueEntity, (entity) => entity.pyachok)
  @JoinColumn({ name: 'venue_id' })
  venue: VenueEntity;
}
