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
import { CommentResDto } from '../comments/dto/res/comment.res.dto';
import { TopCategoryResDto } from '../top/dto/res/top-category.res.dto';
import { TopCategoryWithVenuesResDto } from '../top/dto/res/top-category-with-venues.res.dto';
import { UserResDto } from '../users/dto/res/user.res.dto';
import { VenueListQueryDto } from '../venue/dto/req/venue-list.query.dto';
import { ComplaintResDto } from '../venue/dto/res/complaint.res.dto';
import { ComplaintListResDto } from '../venue/dto/res/complaint-list.res.dto';
import { VenueResDto } from '../venue/dto/res/venue.res.dto';
import { VenueListResDto } from '../venue/dto/res/venue-list.res.dto';
import { AdminAddVenueToTopCategoryReqDto } from './dto/req/admin-add-venue-to-top-category.req.dto';
import { AdminComplaintListQueryDto } from './dto/req/admin-complaint-list.query.dto';
import { AdminCreateTopCategoryReqDto } from './dto/req/admin-create-top-category.req.dto';
import { AdminReorderTopCategoriesReqDto } from './dto/req/admin-reorder-top-categories.req.dto';
import { AdminReorderTopCategoryVenuesReqDto } from './dto/req/admin-reorder-top-category-venues.req.dto';
import { AdminSetVenueRatingReqDto } from './dto/req/admin-set-venue-rating.req.dto';
import { AdminUpdateCommentReqDto } from './dto/req/admin-update-comment.req.dto';
import { AdminUpdateComplaintStatusReqDto } from './dto/req/admin-update-complaint-status.req.dto';
import { AdminUpdateTopCategoryReqDto } from './dto/req/admin-update-top-category.req.dto';
import { AdminUpdateUserReqDto } from './dto/req/admin-update-user.req.dto';
import { AdminUpdateVenueReqDto } from './dto/req/admin-update-venue.req.dto';
import { AdminUserListQueryDto } from './dto/req/admin-user-list.query.dto.';
import { AdminUserListResDto } from './dto/req/admin-user-list.res.dto';
import { AdminVenueListQueryDto } from './dto/req/admin-venue-list.query.dto';
import { AdminVenueViewsQueryDto } from './dto/req/admin-venue-views.query.dto';
import {
  AdminVenueViewsSummaryResDto,
  AdminVenueViewsTimePointResDto,
} from './dto/res/admin-venue-views.res.dto';
import { AdminService } from './services/admin.service';

@ApiBearerAuth()
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('venues/pending')
  public async getPendingVenues(
    @CurrentUser() userData: IUserData,
    @Query() query: VenueListQueryDto,
  ): Promise<VenueListResDto> {
    return await this.adminService.getPendingVenues(userData, query);
  }

  @Get('venues')
  public async getAllVenues(
    @CurrentUser() userData: IUserData,
    @Query() query: AdminVenueListQueryDto,
  ): Promise<VenueListResDto> {
    return await this.adminService.getAllVenues(userData, query);
  }

  @Patch('venues/:venueId/moderate')
  public async approveVenue(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.adminService.approveVenue(userData, venueId);
  }

  @Patch('venues/:venueId/active')
  public async toggleVenueActive(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.adminService.toggleVenueActive(userData, venueId);
  }

  @Patch('venues/:venueId')
  public async updateVenue(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: AdminUpdateVenueReqDto,
  ): Promise<VenueResDto> {
    return await this.adminService.updateVenue(userData, venueId, dto);
  }

  @Delete('venues/:venueId')
  public async deleteVenue(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.adminService.deleteVenue(userData, venueId);
  }

  @Get('users')
  public async getAllUsers(
    @CurrentUser() userData: IUserData,
    @Query() query: AdminUserListQueryDto,
  ): Promise<AdminUserListResDto> {
    return await this.adminService.getAllUsers(userData, query);
  }

  @Patch('users/:userId')
  public async updateUser(
    @CurrentUser() userData: IUserData,
    @Param('userId') userId: string,
    @Body() dto: AdminUpdateUserReqDto,
  ): Promise<UserResDto> {
    return await this.adminService.updateUser(userData, userId, dto);
  }

  public async deleteUser(
    @CurrentUser() userData: IUserData,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.adminService.deleteUser(userData, userId);
  }

  @Patch('venues/:venueId/owner')
  public async reassignVenueOwner(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() body: { userId: string },
  ): Promise<void> {
    await this.adminService.reassignVenueOwner(userData, venueId, body.userId);
  }

  @Get('comments')
  public async getAllComments(
    @CurrentUser() userData: IUserData,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ) {
    return await this.adminService.getAllComments(
      userData,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
      search,
    );
  }

  @Patch('comments/:commentId')
  public async updateComment(
    @CurrentUser() userData: IUserData,
    @Param('commentId') commentId: string,
    @Body() dto: AdminUpdateCommentReqDto,
  ): Promise<CommentResDto> {
    return await this.adminService.updateComment(userData, commentId, dto);
  }

  @Delete('comments/:commentId')
  public async deleteComment(
    @CurrentUser() userData: IUserData,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    await this.adminService.deleteComment(userData, commentId);
  }

  @Patch('venues/:venueId/rating')
  public async setVenueRatingForUser(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Body() dto: AdminSetVenueRatingReqDto,
  ): Promise<void> {
    await this.adminService.setVenueRatingForUser(
      userData,
      venueId,
      dto.userId,
      dto.rating,
    );
  }

  @Delete('venues/:venueId/rating/:userId')
  public async removeVenueRatingForUser(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.adminService.removeVenueRatingForUser(userData, venueId, userId);
  }

  @Get('analytics/venues/:venueId/views/summary')
  public async getVenueViewsSummary(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: AdminVenueViewsQueryDto,
  ): Promise<AdminVenueViewsSummaryResDto> {
    return await this.adminService.getVenueViewsSummary(
      userData,
      venueId,
      query,
    );
  }

  @Get('analytics/venues/:venueId/views/timeseries')
  public async getVenueViewsTimeSeries(
    @CurrentUser() userData: IUserData,
    @Param('venueId') venueId: string,
    @Query() query: AdminVenueViewsQueryDto,
  ): Promise<AdminVenueViewsTimePointResDto[]> {
    return await this.adminService.getVenueViewsTimeSeries(
      userData,
      venueId,
      query,
    );
  }

  @Get('complaints')
  public async getComplaints(
    @CurrentUser() userData: IUserData,
    @Query() query: AdminComplaintListQueryDto,
  ): Promise<ComplaintListResDto> {
    return await this.adminService.getComplaints(userData, query);
  }

  @Get('complaints/:complaintId')
  public async getComplaintById(
    @CurrentUser() userData: IUserData,
    @Param('complaintId') complaintId: string,
  ): Promise<ComplaintResDto> {
    return await this.adminService.getComplaintById(userData, complaintId);
  }

  @Patch('complaints/:complaintId/status')
  public async updateComplaintStatus(
    @CurrentUser() userData: IUserData,
    @Param('complaintId') complaintId: string,
    @Body() dto: AdminUpdateComplaintStatusReqDto,
  ): Promise<ComplaintResDto> {
    return await this.adminService.updateComplaintStatus(
      userData,
      complaintId,
      dto,
    );
  }

  // CMS Settings

  @SkipAuth()
  @Get('settings/public')
  public async getPublicCmsSettings() {
    return await this.adminService.getPublicCmsSettings();
  }

  @Get('settings')
  public async getCmsSettings(@CurrentUser() userData: IUserData) {
    return await this.adminService.getCmsSettings(userData);
  }

  @Patch('settings')
  public async updateCmsSettings(
    @CurrentUser() userData: IUserData,
    @Body() dto: Record<string, string>,
  ) {
    return await this.adminService.updateCmsSettings(userData, dto);
  }

  // TOP

  @Get('top/categories')
  public async getTopCategories(
    @CurrentUser() userData: IUserData,
  ): Promise<TopCategoryResDto[]> {
    return await this.adminService.getTopCategories(userData);
  }

  @Post('top/categories')
  public async createTopCategory(
    @CurrentUser() userData: IUserData,
    @Body() dto: AdminCreateTopCategoryReqDto,
  ): Promise<TopCategoryResDto> {
    return await this.adminService.createTopCategory(userData, dto);
  }

  @Patch('top/categories/order')
  public async reorderTopCategories(
    @CurrentUser() userData: IUserData,
    @Body() dto: AdminReorderTopCategoriesReqDto,
  ): Promise<void> {
    await this.adminService.reorderTopCategories(userData, dto);
  }

  @Get('top/categories/:categoryId')
  public async getTopCategoryWithVenues(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
  ): Promise<TopCategoryWithVenuesResDto> {
    return await this.adminService.getTopCategoryWithVenues(
      userData,
      categoryId,
    );
  }

  @Patch('top/categories/:categoryId')
  public async updateTopCategory(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
    @Body() dto: AdminUpdateTopCategoryReqDto,
  ): Promise<TopCategoryResDto> {
    return await this.adminService.updateTopCategory(userData, categoryId, dto);
  }

  @Delete('top/categories/:categoryId')
  public async deleteTopCategory(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
  ): Promise<void> {
    await this.adminService.deleteTopCategory(userData, categoryId);
  }

  @Post('top/categories/:categoryId/venues')
  public async addVenueToTopCategory(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
    @Body() dto: AdminAddVenueToTopCategoryReqDto,
  ): Promise<void> {
    await this.adminService.addVenueToTopCategory(userData, categoryId, dto);
  }

  @Patch('top/categories/:categoryId/venues/order')
  public async reorderTopCategoryVenues(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
    @Body() dto: AdminReorderTopCategoryVenuesReqDto,
  ): Promise<void> {
    await this.adminService.reorderTopCategoryVenues(userData, categoryId, dto);
  }

  @Delete('top/categories/:categoryId/venues/:venueId')
  public async removeVenueFromTopCategory(
    @CurrentUser() userData: IUserData,
    @Param('categoryId') categoryId: string,
    @Param('venueId') venueId: string,
  ): Promise<void> {
    await this.adminService.removeVenueFromTopCategory(
      userData,
      categoryId,
      venueId,
    );
  }
}
