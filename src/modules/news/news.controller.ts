import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateNewsReqDto } from './dto/req/create-news.req.dto';
import { NewsListQueryDto } from './dto/req/news-list.query.dto';
import { UpdateNewsReqDto } from './dto/req/update-news.req.dto';
import { UpdateNewsActiveReqDto } from './dto/req/update-news-active.req.dto';
import { NewsResDto } from './dto/res/news.res.dto';
import { NewsListResDto } from './dto/res/news-list.res.dto';
import { NewsMapper } from './services/news.mapper';
import { NewsService } from './services/news.service';

@ApiTags('News')
@Controller()
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Post('venues/:venueId/news')
  public async create(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: CreateNewsReqDto,
  ): Promise<NewsResDto> {
    const entity = await this.newsService.create(userData, venueId, dto);
    return NewsMapper.toResponseDTO(entity);
  }

  @Patch('news/:newsId')
  public async update(
    @CurrentUser() userData: IUserData,
    @Param('newsId') newsId: string,
    @Body() dto: UpdateNewsReqDto,
  ): Promise<NewsResDto> {
    const entity = await this.newsService.update(userData, newsId, dto);
    return NewsMapper.toResponseDTO(entity);
  }

  @Patch('news/:newsId/active')
  public async updateActive(
    @CurrentUser() userData: IUserData,
    @Param('newsId') newsId: string,
    @Body() dto: UpdateNewsActiveReqDto,
  ): Promise<NewsResDto> {
    const entity = await this.newsService.updateActive(
      userData,
      newsId,
      dto.isActive,
    );
    return NewsMapper.toResponseDTO(entity);
  }

  @ApiBearerAuth()
  @Get('venues/:venueId/news/manage')
  public async getVenueManageList(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: NewsListQueryDto,
  ): Promise<NewsListResDto> {
    return await this.newsService.getVenueManageList(userData, venueId, query);
  }

  @Delete('news/:newsId')
  public async delete(
    @CurrentUser() userData: IUserData,
    @Param('newsId') newsId: string,
  ): Promise<void> {
    await this.newsService.delete(userData, newsId);
  }

  @Get('news')
  @SkipAuth()
  public async getGlobalList(
    @Query() query: NewsListQueryDto,
  ): Promise<NewsListResDto> {
    return await this.newsService.getGlobalList(query);
  }

  @Get('venues/:venueId/news')
  @SkipAuth()
  public async getVenueList(
    @Param('venueId') venueId: string,
    @Query() query: NewsListQueryDto,
  ): Promise<NewsListResDto> {
    return await this.newsService.getVenueList(venueId, query);
  }
}
