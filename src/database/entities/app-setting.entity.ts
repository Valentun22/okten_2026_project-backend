import { Column, Entity, PrimaryColumn } from 'typeorm';

import { TableNameEnum } from './enums/table-name.enum';

@Entity(TableNameEnum.APP_SETTINGS)
export class AppSettingEntity {
  @PrimaryColumn('text')
  key: string;

  @Column('text', { nullable: true })
  value?: string;

  @Column('text', { nullable: true })
  updatedAt?: string;
}
