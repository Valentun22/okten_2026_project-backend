import { PickType } from '@nestjs/swagger';

import { BaseCommentReqDto } from './base-comment.req.dto';

export class CreateCommentReqDto extends PickType(BaseCommentReqDto, [
  'body',
  'title',
  'image_check',
  'rating',
  'recommendation',
]) {}
