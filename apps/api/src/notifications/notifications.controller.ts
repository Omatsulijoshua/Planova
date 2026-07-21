import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
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
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async registerDevice(
    @Req() req: AuthenticatedRequest,
    @Body() dto: RegisterDeviceDto,
  ) {
    return this.notificationsService.registerDevice(req.user.userId, dto);
  }

  @Post('send-test')
  @HttpCode(HttpStatus.OK)
  async sendTestNotification(
    @Req() req: AuthenticatedRequest,
    @Body('title') title: string,
    @Body('body') body: string,
  ) {
    return this.notificationsService.sendTestNotification(
      req.user.userId,
      title || 'Test Notification',
      body || 'This is a test notification from Planova',
    );
  }
}
