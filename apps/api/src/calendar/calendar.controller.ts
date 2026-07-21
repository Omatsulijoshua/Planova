import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    roles: string[];
  };
}

@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('connect')
  @HttpCode(HttpStatus.OK)
  async connectCalendar(
    @Req() req: AuthenticatedRequest,
    @Body('provider') provider: string,
  ) {
    return this.calendarService.connectCalendar(req.user.userId, provider);
  }

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async syncCalendar(@Req() req: AuthenticatedRequest) {
    return this.calendarService.syncCalendar(req.user.userId);
  }

  @Get('history')
  @HttpCode(HttpStatus.OK)
  async getSyncHistory(@Req() req: AuthenticatedRequest) {
    return this.calendarService.getSyncHistory(req.user.userId);
  }
}
