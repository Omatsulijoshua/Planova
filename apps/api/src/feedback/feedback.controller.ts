import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
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
@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submitFeedback(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.feedbackService.submitFeedback(req.user.userId, dto);
  }
}
