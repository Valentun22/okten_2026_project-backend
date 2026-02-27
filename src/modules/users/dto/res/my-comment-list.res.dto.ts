import { CommentResDto } from '../../../comments/dto/res/comment.res.dto';

export class MyCommentListResDto {
  data: CommentResDto[];
  total: number;
  limit: number;
  offset: number;
}
