import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData(userId: string) {
    // 1. Fetch user preferences to retrieve sleep boundaries
    const prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      throw new NotFoundException('User preferences not found');
    }

    // 2. Fetch user tasks metrics
    const completedTasks = await this.prisma.task.count({
      where: { userId, isCompleted: true, deletedAt: null },
    });

    const totalTasks = await this.prisma.task.count({
      where: { userId, deletedAt: null },
    });

    // 3. Fetch routines metrics (aggregate streaks)
    const routines = await this.prisma.routine.findMany({
      where: { userId, deletedAt: null },
    });
    const routineStreakCount = routines.reduce((acc, curr) => acc + curr.streakCount, 0);

    // 4. Calculate average sleep duration
    const sleepHours = this.calculateSleepHours(prefs.wakeTime, prefs.sleepTime);

    // 5. Compute Focus Score: (completedTasks / totalTasks) * 80 + (sleepHours / 8) * 20
    const taskRatio = totalTasks === 0 ? 1.0 : completedTasks / totalTasks;
    const sleepFactor = Math.min(1.0, sleepHours / 8.0);
    const focusScore = Math.round(taskRatio * 80 + sleepFactor * 20);

    return {
      activeHours: 8.5,
      completedTasks,
      routineStreakCount,
      scheduleConflicts: 0,
      focusScore,
      sleepDuration: sleepHours,
      stressLevel: 3,
      energyLevel: 4,
    };
  }

  private calculateSleepHours(wakeTime: string, sleepTime: string): number {
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);
    const [sleepH, sleepM] = sleepTime.split(':').map(Number);

    let diffMin = (wakeH * 60 + wakeM) - (sleepH * 60 + sleepM);
    if (diffMin < 0) {
      diffMin += 24 * 60; // Wrap around midnight
    }
    return diffMin / 60;
  }
}
