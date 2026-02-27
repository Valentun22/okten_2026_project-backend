import { NewsTypeEnum } from '../../../../database/entities/enums/news-type.enum';

export class NewsListItemResDto {
  id: string;
  title: string;
  body: string;

  type: NewsTypeEnum;
  isActive: boolean;

  avatarNews?: string | null;
  images?: string[] | null;

  created: Date;
  updated: Date;

  venue: {
    id: string;
    name: string;
    avatarVenue?: string | null;
    logoVenue?: string | null;
  };
}
