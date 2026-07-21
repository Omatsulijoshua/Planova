import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';

@Injectable()
export class RoutinesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateRoutineDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.routine.create({
      data: {
        userId,
        name: dto.title,
        frequency: 'DAILY',
        schedule: {
          category: dto.category,
          duration: dto.duration,
          priority: dto.priority,
          flexibility: dto.flexibility,
          daysOfWeek: dto.daysOfWeek || [],
          timeOfDay: dto.timeOfDay || null,
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.routine.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const routine = await this.prisma.routine.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    return routine;
  }

  async remove(userId: string, id: string) {
    const routine = await this.findOne(userId, id);

    return this.prisma.routine.update({
      where: { id: routine.id },
      data: { deletedAt: new Date() },
    });
  }
}
