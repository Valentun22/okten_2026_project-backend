import { NewsListItemResDto } from './news-list-item.res.dto';

export class NewsListResDto {
  data: NewsListItemResDto[];
  total: number;
  limit: number;
  offset: number;
}
