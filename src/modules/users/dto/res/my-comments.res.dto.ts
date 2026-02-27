import { BaseCommentResDto } from '../../../comments/dto/res/base-comment.res.dto';

export class MyCommentsResDto {
  data: BaseCommentResDto[];
  total: number;
  page: number;
  limit: number;
}
