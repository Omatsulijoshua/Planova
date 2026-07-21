import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto } from './dto/subscribe.dto';
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
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async subscribe(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SubscribeDto,
  ) {
    return this.subscriptionsService.subscribe(req.user.userId, dto);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus(@Req() req: AuthenticatedRequest) {
    return this.subscriptionsService.getStatus(req.user.userId);
  }

  @Post('simulate-payment')
  @HttpCode(HttpStatus.OK)
  async simulatePayment(
    @Req() req: AuthenticatedRequest,
    @Body('success') success: boolean,
  ) {
    return this.subscriptionsService.simulatePaymentWebhook(req.user.userId, success);
  }
}
