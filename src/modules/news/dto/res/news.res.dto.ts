import { NewsTypeEnum } from '../../../../database/entities/enums/news-type.enum';

export class NewsResDto {
  id: string;
  title: string;
  body: string;
  type: NewsTypeEnum;
  isActive: boolean;
  avatarNews?: string | null;
  images?: string[] | null;
  venueId: string;
  created: Date;
  updated: Date;
}
