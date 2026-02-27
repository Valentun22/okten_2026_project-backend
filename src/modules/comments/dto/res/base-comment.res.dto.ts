import { CommentRecommendationEnum } from '../../../../database/entities/enums/comment-recommendation';
import { UserResDto } from '../../../users/dto/res/user.res.dto';

export class BaseCommentResDto {
  id: string;
  title: string;
  body: string;
  image_check?: string | null;
  rating: number;
  recommendation?: CommentRecommendationEnum | null;

  created: Date;
  updated: Date;

  user: UserResDto;
  isCritic: boolean;
  isOwner: boolean;
}
