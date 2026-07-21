import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRoleType } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleType.ADMIN, UserRoleType.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.adminService.getUsers();
  }

  @Get('plans')
  @HttpCode(HttpStatus.OK)
  async getPlans() {
    return this.adminService.getPlans();
  }

  @Get('logs')
  @HttpCode(HttpStatus.OK)
  async getLogs(@Query('filter') filter?: string) {
    return this.adminService.getLogs(filter);
  }

  @Post('maintenance')
  @HttpCode(HttpStatus.OK)
  async toggleMaintenance() {
    return this.adminService.toggleMaintenance();
  }

  @Post('feature-flags/:id/toggle')
  @HttpCode(HttpStatus.OK)
  async toggleFeatureFlag(@Param('id') id: string) {
    return this.adminService.toggleFeatureFlag(id);
  }
}
