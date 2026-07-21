import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskTaskDto } from './dto/create-task.dto';
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
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTaskTaskDto,
  ) {
    return this.tasksService.create(req.user.userId, dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.tasksService.findOne(req.user.userId, id);
  }

  @Put(':id/dependencies')
  @HttpCode(HttpStatus.OK)
  async updateDependencies(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body('prerequisiteIds') prerequisiteIds: string[],
  ) {
    return this.tasksService.updateDependencies(req.user.userId, id, prerequisiteIds || []);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    return this.tasksService.remove(req.user.userId, id);
  }
}
