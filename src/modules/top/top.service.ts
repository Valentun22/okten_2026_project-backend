import { Injectable, NotFoundException } from '@nestjs/common';

import { TopCategoryEntity } from '../../database/entities/top-category.entity';
import { TopRepository } from '../repository/services/top.repository';
import { VenueMapper } from '../venue/services/venue.mapper';
import { TopCategoryResDto } from './dto/res/top-category.res.dto';
import { TopCategoryWithVenuesResDto } from './dto/res/top-category-with-venues.res.dto';

@Injectable()
export class TopService {
  constructor(private readonly topRepository: TopRepository) {}

  public async getCategories(): Promise<TopCategoryResDto[]> {
    const categories = await this.topRepository.getActiveCategories();
    return categories.map((c) => this.mapCategory(c));
  }

  public async getCategoryBySlug(slug: string): Promise<TopCategoryWithVenuesResDto> {
    const category = await this.topRepository.getCategoryBySlug(slug);
    if (!category || !category.isActive) {
      throw new NotFoundException('Top category not found');
    }

    const venues = await this.topRepository.getCategoryVenuesPublic(category.id);
    return {
      category: this.mapCategory(category),
      venues: venues.map((v) => VenueMapper.toResponseDTO(v)),
    };
  }

  private mapCategory(entity: TopCategoryEntity): TopCategoryResDto {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      isActive: entity.isActive,
      order: entity.order,
    };
  }
}
