import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskTaskDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const prerequisiteIds = dto.dependencies || [];

    // Verify prerequisites exist
    if (prerequisiteIds.length > 0) {
      const existingPrereqs = await this.prisma.task.findMany({
        where: {
          id: { in: prerequisiteIds },
          userId,
          deletedAt: null,
        },
      });

      if (existingPrereqs.length !== prerequisiteIds.length) {
        throw new NotFoundException('One or more prerequisite tasks not found');
      }
    }

    // Since we are creating a new task, it cannot have incoming edges yet,
    // so a cycle is only possible if taskId is equal to a prerequisiteId (self-dependency)
    if (prerequisiteIds.includes(dto.title)) {
      throw new BadRequestException('A task cannot depend on itself');
    }

    return this.prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          userId,
          title: dto.title,
          category: dto.category,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          estimatedMin: dto.duration,
          priority: dto.priority,
        },
      });

      // Add dependencies
      for (const preId of prerequisiteIds) {
        await tx.taskDependency.create({
          data: {
            taskId: task.id,
            prerequisiteId: preId,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          action: 'task:create',
          resource: 'Task',
          resourceId: task.id,
        },
      });

      return task;
    });
  }

  async updateDependencies(userId: string, taskId: string, prerequisiteIds: string[]) {
    // 1. Verify task exists
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId, deletedAt: null },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // 2. Self-dependency check
    if (prerequisiteIds.includes(taskId)) {
      throw new BadRequestException('Dependency cycle detected: a task cannot depend on itself');
    }

    // 3. Cycle Detection using DFS
    const hasCycle = await this.detectCycle(userId, taskId, prerequisiteIds);
    if (hasCycle) {
      throw new BadRequestException('Dependency cycle detected');
    }

    // 4. Update dependencies
    return this.prisma.$transaction(async (tx) => {
      await tx.taskDependency.deleteMany({
        where: { taskId },
      });

      for (const preId of prerequisiteIds) {
        await tx.taskDependency.create({
          data: {
            taskId,
            prerequisiteId: preId,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          userId,
          action: 'task:update_dependencies',
          resource: 'Task',
          resourceId: taskId,
        },
      });

      return { success: true };
    });
  }

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        dependencies: {
          include: {
            prerequisite: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        dependencies: {
          include: {
            prerequisite: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async remove(userId: string, id: string) {
    const task = await this.findOne(userId, id);

    return this.prisma.task.update({
      where: { id: task.id },
      data: { deletedAt: new Date() },
    });
  }

  private async detectCycle(userId: string, taskId: string, prospectivePrereqIds: string[]): Promise<boolean> {
    // Load all active task dependencies for this user
    const dependencies = await this.prisma.taskDependency.findMany({
      where: {
        task: {
          userId,
          deletedAt: null,
        },
      },
    });

    // Build adjacency list graph
    const adj = new Map<string, string[]>();
    for (const dep of dependencies) {
      if (!adj.has(dep.taskId)) {
        adj.set(dep.taskId, []);
      }
      adj.get(dep.taskId)!.push(dep.prerequisiteId);
    }

    // Add the prospective edges temporarily
    adj.set(taskId, prospectivePrereqIds);

    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (curr: string): boolean => {
      if (stack.has(curr)) return true;
      if (visited.has(curr)) return false;

      visited.add(curr);
      stack.add(curr);

      const neighbors = adj.get(curr) || [];
      for (const next of neighbors) {
        if (dfs(next)) return true;
      }

      stack.delete(curr);
      return false;
    };

    // Run DFS starting at the modified task node
    return dfs(taskId);
  }
}
