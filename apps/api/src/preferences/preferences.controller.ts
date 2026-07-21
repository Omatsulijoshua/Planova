import { Body, Controller, Get, HttpCode, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
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
@Controller('preferences')
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPreferences(@Req() req: AuthenticatedRequest) {
    return this.preferencesService.getPreferences(req.user.userId);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePreferencesDto,
  ) {
    return this.preferencesService.updatePreferences(req.user.userId, dto);
  }
}
