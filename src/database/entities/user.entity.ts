import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { CommentEntity } from './comment.entity';
import { ComplaintEntity } from './complaint.entity';
import { OAuthProviderEnum } from './enums/oauth-provider.enum';
import { RoleUserEnum } from './enums/role.enum';
import { TableNameEnum } from './enums/table-name.enum';
import { FollowEntity } from './follow.entity';
import { LikeEntity } from './like.entity';
import { CreateUpdateModel } from './models/create-update.model';
import { PyachokEntity } from './pyachok.entity';
import { RatingVenueEntity } from './rating-venue.entity';
import { RefreshTokenEntity } from './refresh-token.entity';
import { VenueEntity } from './venue.entity';

@Entity(TableNameEnum.USERS)
export class UserEntity extends CreateUpdateModel {
  @Column('text')
  name: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true, select: false })
  password?: string;

  @Column('text', { nullable: true })
  bio?: string;

  @Column('text', { nullable: true })
  image?: string;

  @Column({ type: 'date', nullable: true })
  birthdate?: string;

  @Column('text', { nullable: true })
  city?: string;

  @Column('text', { nullable: true })
  gender?: string;

  @Column('text', { nullable: true })
  instagram?: string;

  @Column('text', { nullable: true })
  interests?: string;

  @Column({
    type: 'enum',
    enum: RoleUserEnum,
    array: true,
    default: [RoleUserEnum.USER],
  })
  role: RoleUserEnum[];

  @Column({
    type: 'enum',
    enum: OAuthProviderEnum,
    nullable: true,
  })
  oauthProvider?: OAuthProviderEnum;

  @Column('text', { nullable: true })
  oauthId?: string;

  @OneToMany(() => LikeEntity, (entity) => entity.user)
  likes?: LikeEntity[];

  @OneToMany(() => ComplaintEntity, (entity) => entity.user)
  complaints?: ComplaintEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.user)
  comments?: CommentEntity[];

  @OneToMany(() => VenueEntity, (entity) => entity.user)
  venues?: VenueEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.followers)
  followers?: FollowEntity[];

  @OneToMany(() => FollowEntity, (entity) => entity.followings)
  followings?: FollowEntity[];

  @OneToMany(() => RatingVenueEntity, (entity) => entity.user)
  rating?: RatingVenueEntity[];

  @OneToMany(() => PyachokEntity, (entity) => entity.user)
  pyachok?: PyachokEntity[];

  @ManyToMany(() => VenueEntity, (venue) => venue.favoritedBy, {
    cascade: false,
  })
  @JoinTable({
    name: 'user_favorite_venues',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'venue_id', referencedColumnName: 'id' },
  })
  favoriteVenues?: VenueEntity[];
}
