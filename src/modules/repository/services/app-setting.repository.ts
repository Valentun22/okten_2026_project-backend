import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AppSettingEntity } from '../../../database/entities/app-setting.entity';

@Injectable()
export class AppSettingRepository extends Repository<AppSettingEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(AppSettingEntity, dataSource.manager);
  }

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.find();

    return rows.reduce((acc: Record<string, string>, r) => {
      acc[r.key] = r.value ?? '';
      return acc;
    }, {});
  }

  async upsertSetting(key: string, value: string): Promise<void> {
    await this.save({
      key,
      value,
      updatedAt: new Date().toISOString(),
    }); //todo глянути що тут не так
  }

  async upsertManySettings(data: Record<string, string>): Promise<void> {
    const now = new Date().toISOString();

    const entities = Object.entries(data).map(([key, value]) => ({
      key,
      value,
      updatedAt: now,
    }));

    await this.save(entities);
  }
}
