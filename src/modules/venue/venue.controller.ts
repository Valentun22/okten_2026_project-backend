import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreateVenueReqDto } from './dto/req/create-venue.req.dto';
import { CreateComplaintReqDto } from './dto/req/create-complaint.req.dto';
import { ComplaintListQueryDto } from './dto/req/complaint-list.query.dto';
import { ContactVenueManagerReqDto } from './dto/req/contact-venue-manager.req.dto';
import { SetVenueRatingReqDto } from './dto/req/set-venue-rating.req.dto';
import { UpdateVenueReqDto } from './dto/req/update-venue.req.dto';
import { VenueListQueryDto } from './dto/req/venue-list.query.dto';
import { VenueViewsQueryDto } from './dto/req/venue-views.query.dto';
import { ComplaintListResDto } from './dto/res/complaint-list.res.dto';
import { ComplaintResDto } from './dto/res/complaint.res.dto';
import { VenueResDto } from './dto/res/venue.res.dto';
import { VenueListResDto } from './dto/res/venue-list.res.dto';
import {
  VenueViewsSummaryResDto,
  VenueViewsTimePointResDto,
} from './dto/res/venue-views.res.dto';
import { VenueMapper } from './services/venue.mapper';
import { VenueService } from './services/venue.service';

@ApiBearerAuth()
@ApiTags('Venue')
@Controller('venues')
export class VenueController {
  constructor(private readonly service: VenueService) {}

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @SkipAuth()
  @Get()
  public async getList(
    @CurrentUser() userData: IUserData | undefined,
    @Query() query: VenueListQueryDto,
  ): Promise<VenueListResDto> {
    const [entities, total] = await this.service.getList(userData, query);
    return VenueMapper.toResponseListDTO(entities, total, query);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post()
  public async create(
    @CurrentUser() userData: IUserData,
    @Body() dto: CreateVenueReqDto,
  ): Promise<VenueResDto> {
    const result = await this.service.create(userData, dto);
    return VenueMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @SkipAuth()
  @Get(':venueId')
  public async getById(
    @CurrentUser() userData: IUserData | undefined,
    @Param('venueId') venueId: string,
    @Req() req: Request,
  ): Promise<VenueResDto> {
    const result = await this.service.getById(userData as any, venueId);

    await this.service.logViewSafe({
      venueId,
      userId: userData?.userId,
      ip: req.ip,
      userAgent: req.headers['user-agent'] as string,
    });

    return VenueMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Patch(':venueId')
  public async update(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: UpdateVenueReqDto,
  ): Promise<VenueResDto> {
    const result = await this.service.update(userData, venueId, dto);
    return VenueMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':venueId')
  public async delete(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.service.delete(userData, venueId);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':venueId/like')
  public async like(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<VenueResDto> {
    const result = await this.service.like(userData, venueId);
    return VenueMapper.toResponseDTO(result);
  }

  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':venueId/like')
  public async unlike(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<VenueResDto> {
    const result = await this.service.unlike(userData, venueId);
    return VenueMapper.toResponseDTO(result);
  }

  @ApiBearerAuth()
  @Post(':venueId/favorite')
  public async addToFavorites(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.service.addToFavorites(userData.userId, venueId);
  }

  @ApiBearerAuth()
  @Delete(':venueId/favorite')
  public async removeFromFavorites(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.service.removeFromFavorites(userData.userId, venueId);
  }

  @ApiBearerAuth()
  @Post(':venueId/rating')
  public async setRating(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: SetVenueRatingReqDto,
  ): Promise<void> {
    await this.service.setRating(userData.userId, venueId, dto.rating);
  }

  @ApiBearerAuth()
  @Delete(':venueId/rating')
  public async removeRating(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.service.removeRating(userData.userId, venueId);
  }

  // Stub: user can send a message to venue manager (we validate that venue exists)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':venueId/contact')
  public async contactManager(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: ContactVenueManagerReqDto,
  ): Promise<void> {
    await this.service.contactManager(userData, venueId, dto.message);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':venueId/analytics/views/summary')
  public async getViewsSummary(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: VenueViewsQueryDto,
  ): Promise<VenueViewsSummaryResDto> {
    return await this.service.getVenueViewsSummary(userData, venueId, query);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':venueId/analytics/views/timeseries')
  public async getViewsTimeSeries(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: VenueViewsQueryDto,
  ): Promise<VenueViewsTimePointResDto[]> {
    return await this.service.getVenueViewsTimeSeries(userData, venueId, query);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Post(':venueId/complaints')
  public async createComplaint(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: CreateComplaintReqDto,
  ): Promise<ComplaintResDto> {
    return await this.service.createComplaint(userData, venueId, dto);
  }

  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':venueId/complaints')
  public async getComplaintsForVenue(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: ComplaintListQueryDto,
  ): Promise<ComplaintListResDto> {
    return await this.service.getComplaintsForVenue(userData, venueId, query);
  }
}
