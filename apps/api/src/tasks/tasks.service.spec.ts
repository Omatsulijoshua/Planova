import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    taskDependency: {
      create: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task successfully without dependencies', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.task.create.mockResolvedValue({ id: 'task-1', title: 'Task 1' });

      const res = await service.create('user-1', {
        title: 'Task 1',
        duration: 45,
        priority: 'MEDIUM' as any,
      });

      expect(res.title).toBe('Task 1');
      expect(prisma.task.create).toHaveBeenCalled();
    });
  });

  describe('updateDependencies (Cycle Detection)', () => {
    it('should block circular dependencies (A depends on B, B depends on A)', async () => {
      prisma.task.findFirst
        .mockResolvedValueOnce({ id: 'task-A', userId: 'user-1' }) // for A
        .mockResolvedValueOnce({ id: 'task-B', userId: 'user-1' }); // for B

      // Mock existing dependencies in DB: B -> A (B depends on A)
      prisma.taskDependency.findMany.mockResolvedValue([
        { taskId: 'task-B', prerequisiteId: 'task-A' },
      ]);

      // Attempt to make A depend on B (prospective edges: task-A -> task-B)
      // This forms the graph:
      // A -> B
      // B -> A
      // which has a cycle!
      await expect(
        service.updateDependencies('user-1', 'task-A', ['task-B']),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow valid acyclic dependencies', async () => {
      prisma.task.findFirst.mockResolvedValue({ id: 'task-A', userId: 'user-1' });
      // Empty existing dependencies in DB
      prisma.taskDependency.findMany.mockResolvedValue([]);
      prisma.taskDependency.create.mockResolvedValue({ id: 'dep-1' });

      const res = await service.updateDependencies('user-1', 'task-A', ['task-B']);
      expect(res.success).toBe(true);
      expect(prisma.taskDependency.create).toHaveBeenCalledWith({
        data: { taskId: 'task-A', prerequisiteId: 'task-B' },
      });
    });
  });
});
