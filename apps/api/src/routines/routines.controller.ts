import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
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
@Controller('routines')
export class RoutinesController {
  constructor(private routinesService: RoutinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRoutineDto,
  ) {
    return this.routinesService.create(req.user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.routinesService.findAll(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.routinesService.findOne(req.user.userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.routinesService.remove(req.user.userId, id);
  }
}
