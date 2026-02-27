import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { TopCategoryResDto } from './dto/res/top-category.res.dto';
import { TopCategoryWithVenuesResDto } from './dto/res/top-category-with-venues.res.dto';
import { TopService } from './top.service';

@ApiTags('Top')
@Controller('top')
export class TopController {
  constructor(private readonly topService: TopService) {}

  @SkipAuth()
  @Get('categories')
  public async getCategories(): Promise<TopCategoryResDto[]> {
    return await this.topService.getCategories();
  }

  @SkipAuth()
  @Get('categories/:slug')
  public async getCategoryBySlug(
    @Param('slug') slug: string,
  ): Promise<TopCategoryWithVenuesResDto> {
    return await this.topService.getCategoryBySlug(slug);
  }
}
