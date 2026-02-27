import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { memoryStorage } from 'multer';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CommentListQueryDto } from './dto/req/comment-list.query.dto';
import { CreateCommentReqDto } from './dto/req/create-comment.req.dto';
import { UpdateCommentReqDto } from './dto/req/update-comment.req.dto';
import { CommentResDto } from './dto/res/comment.res.dto';
import { CommentListResDto } from './dto/res/comment-list.res.dto';
import { CommentMapper } from './services/comment.mapper';
import { CommentService } from './services/comment.service';
import { CommentS3Service } from './services/comment-s3.service';

@ApiBearerAuth()
@ApiTags('Comments')
@UseGuards(JwtAccessGuard)
@Controller('comments')
@Controller()
export class CommentController {
  constructor(
    private readonly service: CommentService,
    private readonly commentS3Service: CommentS3Service,
  ) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @SkipAuth()
  @Get('venues/:venueId/comments')
  public async getListByVenue(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: CommentListQueryDto,
  ): Promise<CommentListResDto> {
    const [entities, total] = await this.service.getListByVenue(
      userData,
      venueId,
      query,
    );
    return CommentMapper.toResponseListDTO(userData, entities, total, query);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post('venues/:venueId/comments')
  public async create(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: CreateCommentReqDto,
  ): Promise<CommentResDto> {
    const entity = await this.service.create(userData, venueId, dto);
    const full = await this.service.getById(userData, entity.id);
    return CommentMapper.toResponseDTO(userData, full);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @SkipAuth()
  @Get('comments/:commentId')
  public async getById(
    @CurrentUser() userData: IUserData,
    @Param('commentId') commentId: string,
  ): Promise<CommentResDto> {
    const entity = await this.service.getById(userData, commentId);
    return CommentMapper.toResponseDTO(userData, entity);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch('comments/:commentId')
  public async update(
    @CurrentUser() userData: IUserData,
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentReqDto,
  ): Promise<CommentResDto> {
    const entity = await this.service.update(userData, commentId, dto);
    const full = await this.service.getById(userData, entity.id);
    return CommentMapper.toResponseDTO(userData, full);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete('comments/:commentId')
  public async delete(
    @CurrentUser() userData: IUserData,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    await this.service.delete(userData, commentId);
  }

  @Post('upload-check')
  @Throttle({ default: { ttl: 60, limit: 10 } })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const ok = /\/(jpg|jpeg|png)$/i.test(file.mimetype);
        cb(ok ? null : new BadRequestException('Only jpg/jpeg/png'), ok);
      },
    }),
  )
  public async uploadCheck(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    return await this.commentS3Service.uploadCheck(file);
  }
}
