import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from 'src/modules/email/services/email.service';
import { UserRepository } from 'src/modules/repository/services/user.repository';

import { RoleUserEnum } from '../../../database/entities/enums/role.enum';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { PyachokRepository } from '../../repository/services/pyachok.repository';
import { VenueRepository } from '../../repository/services/venue.repository';
import { CreatePyachokReqDto } from '../dto/req/create-pyachok.req.dto';
import { PyachokListQueryDto } from '../dto/req/pyachok-list.query.dto';
import { PyachokStatusEnum } from '../enums/pyachok-status.enum';

@Injectable()
export class PyachokService {
  constructor(
    private readonly pyachokRepo: PyachokRepository,
    private readonly venueRepo: VenueRepository,
    private readonly userRepo: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  private getRoles(user: IUserData): RoleUserEnum[] {
    const anyUser = user as any;
    return (anyUser.roles || anyUser.role || []) as RoleUserEnum[];
  }

  private hasRole(user: IUserData, role: RoleUserEnum): boolean {
    return this.getRoles(user).includes(role);
  }

  private async assertVenueManageAccess(user: IUserData, venueId: string) {
    const venue = await this.venueRepo.findOne({
      where: { id: venueId },
      select: ['id', 'user_id', 'email', 'name'],
    });

    if (!venue) throw new NotFoundException('Venue not found');

    if (this.hasRole(user, RoleUserEnum.SUPERADMIN)) return venue;

    const isVenueAdmin = this.hasRole(user, RoleUserEnum.VENUE_ADMIN);
    const isOwner = venue.user_id === user.userId;

    if (!isVenueAdmin || !isOwner) {
      throw new ForbiddenException('No permissions for this venue');
    }

    return venue;
  }

  public async getVenuePublicList(venueId: string, query: PyachokListQueryDto) {
    const fixed: PyachokListQueryDto = {
      ...query,
      status: PyachokStatusEnum.OPEN,
    };

    const [items, total] = await this.pyachokRepo.getVenuePublicList(
      venueId,
      fixed,
    );

    return {
      total,
      page: fixed.page ?? 1,
      limit: fixed.limit ?? 20,
      items,
    };
  }

  public async create(
    userId: string,
    venueId: string,
    dto: CreatePyachokReqDto,
  ) {
    const venue = await this.venueRepo.findOne({
      where: { id: venueId },
      select: ['id', 'user_id', 'email', 'name', 'city', 'address'],
    });

    if (!venue) throw new NotFoundException('Venue not found');

    const created = await this.pyachokRepo.save({
      user_id: userId,
      venue_id: venueId,
      date: dto.date,
      time: dto.time,
      purpose: dto.purpose,
      message: dto.message,
      peopleCount: dto.peopleCount,
      genderPreference: dto.genderPreference,
      payer: dto.payer,
      expectedBudget: dto.expectedBudget,
      status: PyachokStatusEnum.OPEN,
    });

    let toEmail: string | null = venue.email ?? null;

    if (!toEmail) {
      const owner = await this.userRepo.findOne({
        where: { id: venue.user_id },
        select: ['id', 'email', 'name'],
      });
      toEmail = owner?.email ?? null;
    }

    if (toEmail) {
      const subject = `Пиячок: нова заявка для "${venue.name}"`;

      const text = [
        `Заклад: ${venue.name}`,
        `Адреса: ${venue.city || ''} ${venue.address || ''}`.trim(),
        `Дата: ${dto.date}`,
        `Час: ${dto.time}`,
        dto.peopleCount != null ? `К-сть людей: ${dto.peopleCount}` : null,
        dto.genderPreference
          ? `Стать (побажання): ${dto.genderPreference}`
          : null,
        dto.payer ? `Хто оплачує: ${dto.payer}` : null,
        dto.expectedBudget != null ? `Бюджет: ${dto.expectedBudget}` : null,
        dto.purpose ? `Мета: ${dto.purpose}` : null,
        dto.message ? `Повідомлення власнику: ${dto.message}` : null,
        '',
        `ID заявки: ${created.id}`,
      ]
        .filter(Boolean)
        .join('\n');

      await this.emailService.sendMail(toEmail, subject, text);
    }

    return created;
  }

  public async getMy(userId: string, query: PyachokListQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const qb = this.pyachokRepo.createQueryBuilder('p');
    qb.leftJoinAndSelect('p.venue', 'venue');

    qb.andWhere('p.user_id = :userId', { userId });

    if (query.status) {
      qb.andWhere('p.status = :status', { status: query.status });
    }
    if (query.date) {
      qb.andWhere('p.date = :date', { date: query.date });
    }

    qb.orderBy('p.created', 'DESC');
    qb.take(limit);
    qb.skip(skip);

    const [items, total] = await qb.getManyAndCount();

    return { total, page, limit, items };
  }

  public async closeMy(userId: string, id: string) {
    const item = await this.pyachokRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Request not found');

    if (item.user_id !== userId) {
      throw new ForbiddenException('Not your request');
    }

    if (item.status === PyachokStatusEnum.CLOSED) return item;

    item.status = PyachokStatusEnum.CLOSED;
    return await this.pyachokRepo.save(item);
  }

  public async deleteMy(userId: string, id: string) {
    const item = await this.pyachokRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Request not found');

    if (item.user_id !== userId) {
      throw new ForbiddenException('Not your request');
    }

    await this.pyachokRepo.remove(item);
    return { deleted: true };
  }

  public async getVenueManageList(
    user: IUserData,
    venueId: string,
    query: PyachokListQueryDto,
  ) {
    await this.assertVenueManageAccess(user, venueId);

    const [items, total] = await this.pyachokRepo.getVenueManageList(
      venueId,
      query,
    );

    return {
      total,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      items,
    };
  }
}
