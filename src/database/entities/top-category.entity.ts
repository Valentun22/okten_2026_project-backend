import {
  Column,
  Entity,
  Index,
  OneToMany,
  Unique,
} from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { TopCategoryVenueEntity } from './top-category-venue.entity';

@Entity(TableNameEnum.TOP_CATEGORIES)
@Unique('UQ_top_categories_slug', ['slug'])
export class TopCategoryEntity extends CreateUpdateModel {
  @Column('text')
  title: string;

  @Index('IDX_top_categories_slug')
  @Column('text')
  slug: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Index('IDX_top_categories_order')
  @Column('int', { default: 0 })
  order: number;

  @OneToMany(() => TopCategoryVenueEntity, (it) => it.category)
  items?: TopCategoryVenueEntity[];
}
