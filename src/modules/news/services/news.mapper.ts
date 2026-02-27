import { NewsEntity } from '../../../database/entities/news.entity';
import { NewsListQueryDto } from '../dto/req/news-list.query.dto';
import { NewsResDto } from '../dto/res/news.res.dto';
import { NewsListResDto } from '../dto/res/news-list.res.dto';
import { NewsListItemResDto } from '../dto/res/news-list-item.res.dto';

export class NewsMapper {
  public static toListItemDTO(entity: NewsEntity): NewsListItemResDto {
    return {
      id: entity.id,
      title: entity.title,
      body: entity.body,
      type: entity.type,
      isActive: entity.isActive,
      avatarNews: entity.avatarNews ?? null,
      images: entity.images ?? null,
      created: entity.created,
      updated: entity.updated,
      venue: {
        id: entity.venue?.id,
        name: entity.venue?.name,
        avatarVenue: entity.venue?.avatarVenue ?? null,
        logoVenue: entity.venue?.logoVenue ?? null,
      },
    };
  }

  public static toListDTO(
    entities: NewsEntity[],
    total: number,
    query: NewsListQueryDto,
  ): NewsListResDto {
    return {
      data: entities.map(this.toListItemDTO),
      total,
      limit: query.limit ?? 10,
      offset: query.offset ?? 0,
    };
  }

  public static toResponseDTO(entity: NewsEntity): NewsResDto {
    return {
      id: entity.id,
      title: entity.title,
      body: entity.body,
      type: entity.type,
      isActive: entity.isActive,
      avatarNews: entity.avatarNews ?? null,
      images: entity.images ?? null,
      venueId: entity.venue_id,
      created: entity.created,
      updated: entity.updated,
    };
  }
}
