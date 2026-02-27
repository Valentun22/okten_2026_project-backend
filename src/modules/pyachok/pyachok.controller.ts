import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SkipAuth } from '../auth/decorators/skip-auth.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { CreatePyachokReqDto } from './dto/req/create-pyachok.req.dto';
import { PyachokListQueryDto } from './dto/req/pyachok-list.query.dto';
import { PyachokService } from './services/pyachok.service';

@ApiTags('Pyachok')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard)
@Controller()
export class PyachokController {
  constructor(private readonly service: PyachokService) {}

  @SkipAuth()
  @ApiOperation({ summary: 'Public list: open requests by venue' })
  @Get('/venues/:venueId/pyachok')
  getVenuePublicList(
    @Param('venueId', new ParseUUIDPipe()) venueId: string,
    @Query() query: PyachokListQueryDto,
  ) {
    return this.service.getVenuePublicList(venueId, query);
  }

  @ApiOperation({ summary: 'Create request ("Пиячок" button on venue page)' })
  @Post('/venues/:venueId/pyachok')
  create(
    @Param('venueId', new ParseUUIDPipe()) venueId: string,
    @CurrentUser() user: IUserData,
    @Body() dto: CreatePyachokReqDto,
  ) {
    return this.service.create(user.userId, venueId, dto);
  }

  @ApiOperation({ summary: 'My requests' })
  @Get('/users/me/pyachok')
  getMy(@CurrentUser() user: IUserData, @Query() query: PyachokListQueryDto) {
    return this.service.getMy(user.userId, query);
  }

  @ApiOperation({ summary: 'Close my request' })
  @Patch('/pyachok/:id/close')
  closeMy(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: IUserData,
  ) {
    return this.service.closeMy(user.userId, id);
  }

  @ApiOperation({ summary: 'Delete my request' })
  @Delete('/pyachok/:id')
  deleteMy(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: IUserData,
  ) {
    return this.service.deleteMy(user.userId, id);
  }

  @ApiOperation({ summary: 'Manage list for venue owner/admin' })
  @Get('/venues/:venueId/pyachok/manage')
  getVenueManageList(
    @Param('venueId', new ParseUUIDPipe()) venueId: string,
    @CurrentUser() user: IUserData,
    @Query() query: PyachokListQueryDto,
  ) {
    return this.service.getVenueManageList(user, venueId, query);
  }
}
