import { ComplaintEntity } from '../../../database/entities/complaint.entity';
import { ComplaintListResDto } from '../dto/res/complaint-list.res.dto';
import { ComplaintResDto } from '../dto/res/complaint.res.dto';

export class ComplaintMapper {
  public static toResponseDTO(entity: ComplaintEntity): ComplaintResDto {
    return {
      id: entity.id,
      venueId: entity.venue_id,
      userId: entity.user_id,
      type: entity.type,
      targetId: entity.targetId,
      reason: entity.reason,
      status: entity.status,
      created: entity.created,
      user: entity.user
        ? {
            id: entity.user.id,
            name: entity.user.name,
            image: entity.user.image,
          }
        : undefined,
      venue: entity.venue
        ? {
            id: entity.venue.id,
            name: entity.venue.name,
          }
        : undefined,
    };
  }

  public static toListResponseDTO(
    data: ComplaintEntity[],
    total: number,
    limit: number,
    offset: number,
  ): ComplaintListResDto {
    return {
      data: data.map(this.toResponseDTO),
      total,
      limit,
      offset,
    };
  }
}
