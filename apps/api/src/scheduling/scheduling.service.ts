import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CspSolver, SolverTask, SolverRoutine, SolverPreferences } from '@planova/scheduling-engine';

@Injectable()
export class SchedulingService {
  constructor(private prisma: PrismaService) {}

  async optimizeTimetable(userId: string) {
    // 1. Fetch user preferences
    const prefs = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      throw new NotFoundException('User preferences not found. Please complete onboarding.');
    }

    // 2. Fetch active routines
    const routines = await this.prisma.routine.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    // 3. Fetch pending tasks
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        isCompleted: false,
        deletedAt: null,
      },
    });

    // 4. Map routines into solver formats
    const solverRoutines: SolverRoutine[] = routines.map((r) => {
      const schedule = (r.schedule as any) || {};
      const timeOfDay = schedule.timeOfDay || '09:00';
      const [hour, min] = timeOfDay.split(':').map(Number);

      return {
        id: r.id,
        name: r.name,
        durationMin: schedule.duration || 60,
        daysOfWeek: schedule.daysOfWeek || [1, 2, 3, 4, 5],
        startHour: hour,
        startMinute: min,
      };
    });

    // 5. Map tasks into solver formats
    const solverTasks: SolverTask[] = tasks.map((t) => {
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
      if (t.priority === 'LOW' || t.priority === 'HIGH') {
        priority = t.priority;
      }

      return {
        id: t.id,
        title: t.title,
        durationMin: t.estimatedMin,
        priority,
      };
    });

    const solverPrefs: SolverPreferences = {
      wakeTime: prefs.wakeTime,
      sleepTime: prefs.sleepTime,
    };

    // 6. Run CspSolver
    const solver = new CspSolver();
    const result = solver.solve(solverTasks, solverRoutines, solverPrefs);

    // 7. Write audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'timetable:optimize',
        resource: 'UserPreference',
        resourceId: prefs.id,
      },
    });

    return result;
  }
}
