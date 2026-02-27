import { Column, Entity, ManyToMany, VirtualColumn } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';
import { CreateUpdateModel } from './models/create-update.model';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.TAGS)
export class TagEntity extends CreateUpdateModel {
  @Column('text', { unique: true })
  name: string;

  @VirtualColumn({ query: () => 'NULL' })
  venueCount?: number;

  @ManyToMany(() => VenueEntity, (entity) => entity.tags)
  venues?: VenueEntity[];
}
