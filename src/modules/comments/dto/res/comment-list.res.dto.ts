import { CommentListItemResDto } from './comment-list-item.res.dto';

export class CommentListResDto {
  data: CommentListItemResDto[];
  total: number;
  limit: number;
  offset: number;
}
