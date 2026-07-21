import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
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
@Controller('scheduling')
export class SchedulingController {
  constructor(private schedulingService: SchedulingService) {}

  @Post('optimize')
  @HttpCode(HttpStatus.OK)
  async optimize(@Req() req: AuthenticatedRequest) {
    return this.schedulingService.optimizeTimetable(req.user.userId);
  }
}
