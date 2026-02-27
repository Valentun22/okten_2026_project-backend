import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { TopCategoryEntity } from './top-category.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.TOP_CATEGORY_VENUES)
@Unique('UQ_top_category_venue', ['category_id', 'venue_id'])
export class TopCategoryVenueEntity extends CreateUpdateModel {
  @Index('IDX_top_category_venues_category_id')
  @Column('uuid')
  category_id: string;

  @Index('IDX_top_category_venues_venue_id')
  @Column('uuid')
  venue_id: string;

  @Index('IDX_top_category_venues_order')
  @Column('int', { default: 0 })
  order: number;

  @ManyToOne(() => TopCategoryEntity, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category?: TopCategoryEntity;

  @ManyToOne(() => VenueEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venue_id' })
  venue?: VenueEntity;
}
