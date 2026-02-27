import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CommentEntity } from './comment.entity';
import { ComplaintEntity } from './complaint.entity';
import { VenueCategoryEnum } from './enums/place-type.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { LikeEntity } from './like.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { NewsEntity } from './news.entity';
import { PyachokEntity } from './pyachok.entity';
import { RatingVenueEntity } from './rating-venue.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';
import { TopCategoryVenueEntity } from './top-category-venue.entity';

@Entity(TableNameEnum.VENUES)
export class VenueEntity extends CreateUpdateModel {
  @Column('text')
  name: string;

  @Column('text', { nullable: true })
  avatarVenue?: string;

  @Column('text', { nullable: true })
  logoVenue?: string;

  @Column('text', { array: true, nullable: true })
  image?: string[];

  @Column('text', { nullable: true })
  menu?: string;

  @Column({ type: 'float', nullable: true })
  averageCheck?: number;

  @Column('jsonb', { nullable: true })
  workingHours?: {
    mon?: string;
    tue?: string;
    wed?: string;
    thu?: string;
    fri?: string;
    sat?: string;
    sun?: string;
  };

  @Column('text')
  city?: string;

  @Column('text')
  address?: string;

  @Column({
    type: 'enum',
    enum: VenueCategoryEnum,
    array: true,
    nullable: true,
  })
  categories?: VenueCategoryEnum[];

  @Column('boolean', { default: false })
  isModerated: boolean;

  @Column('boolean', { default: false })
  isActive: boolean;

  @Column('text', { nullable: true })
  phone?: string;

  @Column('text', { nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  website?: string;

  @Column('jsonb', { nullable: true })
  socials?: {
    instagram?: string;
    facebook?: string;
    telegram?: string;
  };

  @Column('text')
  description?: string;

  @Column('boolean', { default: false })
  hasWiFi: boolean;

  @Column('boolean', { default: false })
  hasParking: boolean;

  @Column('boolean', { default: false })
  liveMusic: boolean;

  @Column('boolean', { default: false })
  petFriendly: boolean;

  @Column('boolean', { default: false })
  hasTerrace: boolean;

  @Column('boolean', { default: false })
  smokingAllowed: boolean;

  @Column('boolean', { default: false })
  cardPayment: boolean;

  @OneToMany(() => LikeEntity, (entity) => entity.venue)
  likes?: LikeEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.venue)
  comments?: CommentEntity[];

  @OneToMany(() => NewsEntity, (entity) => entity.venue)
  news?: NewsEntity[];

  @OneToMany(() => ComplaintEntity, (entity) => entity.venue)
  complaints?: ComplaintEntity[];

  @OneToMany(() => RatingVenueEntity, (entity) => entity.venue)
  rating?: RatingVenueEntity[];

  @OneToMany(() => TopCategoryVenueEntity, (entity) => entity.venue)
  topItems?: TopCategoryVenueEntity[];

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.venues)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @ManyToMany(() => TagEntity, (entity) => entity.venues)
  @JoinTable()
  tags?: TagEntity[];

  @OneToMany(() => PyachokEntity, (entity) => entity.venue)
  pyachok?: PyachokEntity[];

  @ManyToMany(() => UserEntity, (user) => user.favoriteVenues)
  favoritedBy?: UserEntity[];
}
