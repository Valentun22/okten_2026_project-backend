import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { NewsTypeEnum } from './enums/news-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.NEWS)
export class NewsEntity extends CreateUpdateModel {
  @Column('text')
  body: string;

  @Column('text')
  title: string;

  @Column({
    type: 'enum',
    enum: NewsTypeEnum,
  })
  type: NewsTypeEnum;

  @Column({ default: true })
  isActive: boolean;

  @Column('text', { nullable: true })
  avatarNews?: string;

  @Column('text', { array: true, nullable: true })
  images?: string[];

  @Column()
  venue_id: string;
  @ManyToOne(() => VenueEntity, (entity) => entity.news)
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;
}
