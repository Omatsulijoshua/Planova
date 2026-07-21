import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingService } from './scheduling.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SchedulingService', () => {
  let service: SchedulingService;
  let prisma: any;

  const mockPrismaService = {
    userPreference: {
      findUnique: jest.fn(),
    },
    routine: {
      findMany: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SchedulingService>(SchedulingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('optimizeTimetable', () => {
    it('should run solver and return schedule result successfully', async () => {
      prisma.userPreference.findUnique.mockResolvedValue({
        id: 'pref-1',
        wakeTime: '07:00',
        sleepTime: '22:00',
      });
      prisma.routine.findMany.mockResolvedValue([
        {
          id: 'routine-1',
          name: 'Work Block',
          schedule: {
            duration: 60,
            timeOfDay: '09:00',
            daysOfWeek: [1, 2, 3, 4, 5],
          },
        },
      ]);
      prisma.task.findMany.mockResolvedValue([
        {
          id: 'task-1',
          title: 'Math Study',
          estimatedMin: 60,
          priority: 'HIGH',
        },
      ]);

      const result = await service.optimizeTimetable('user-1');

      expect(result.success).toBe(true);
      expect(result.schedule.length).toBe(2); // 1 routine + 1 task
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if preferences do not exist', async () => {
      prisma.userPreference.findUnique.mockResolvedValue(null);

      await expect(service.optimizeTimetable('user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
