import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let prisma: any;

  const mockPrismaService = {
    userPreference: {
      findUnique: jest.fn(),
    },
    task: {
      count: jest.fn(),
    },
    routine: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardData', () => {
    it('should calculate Focus Score and stats successfully', async () => {
      // Sleep from 22:00 to 07:00 = 9 hours
      prisma.userPreference.findUnique.mockResolvedValue({
        wakeTime: '07:00',
        sleepTime: '22:00',
      });
      // 3 completed out of 4 total tasks (75% ratio)
      prisma.task.count
        .mockResolvedValueOnce(3) // completed count
        .mockResolvedValueOnce(4); // total count

      prisma.routine.findMany.mockResolvedValue([
        { streakCount: 5 },
        { streakCount: 2 },
      ]);

      const res = await service.getDashboardData('user-1');

      // Focus Score formula:
      // taskRatio = 3/4 = 0.75
      // sleepFactor = 9/8 -> capped at 1.0
      // focusScore = round(0.75 * 80 + 1.0 * 20) = round(60 + 20) = 80
      expect(res.focusScore).toBe(80);
      expect(res.sleepDuration).toBe(9);
      expect(res.routineStreakCount).toBe(7);
      expect(res.completedTasks).toBe(3);
    });

    it('should throw NotFoundException if preferences are missing', async () => {
      prisma.userPreference.findUnique.mockResolvedValue(null);

      await expect(service.getDashboardData('user-1')).rejects.toThrow(NotFoundException);
    });
  });
});
