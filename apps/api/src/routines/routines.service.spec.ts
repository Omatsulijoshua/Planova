import { Test, TestingModule } from '@nestjs/testing';
import { RoutinesService } from './routines.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { RoutineCategory, RoutinePriority, RoutineFlexibility } from './dto/create-routine.dto';

describe('RoutinesService', () => {
  let service: RoutinesService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    routine: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoutinesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RoutinesService>(RoutinesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a routine successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.routine.create.mockResolvedValue({ id: 'routine-1', name: 'Morning Yoga' });

      const res = await service.create('user-1', {
        title: 'Morning Yoga',
        category: RoutineCategory.EXERCISE,
        duration: 30,
        priority: RoutinePriority.MEDIUM,
        flexibility: RoutineFlexibility.FLEXIBLE,
      });

      expect(res.name).toBe('Morning Yoga');
      expect(prisma.routine.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.create('user-1', {
          title: 'Morning Yoga',
          category: RoutineCategory.EXERCISE,
          duration: 30,
          priority: RoutinePriority.MEDIUM,
          flexibility: RoutineFlexibility.FLEXIBLE,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should load active user routines', async () => {
      prisma.routine.findMany.mockResolvedValue([{ id: 'routine-1' }]);
      const res = await service.findAll('user-1');
      expect(res.length).toBe(1);
    });
  });

  describe('remove', () => {
    it('should soft delete routine by updating deletedAt timestamp', async () => {
      prisma.routine.findFirst.mockResolvedValue({ id: 'routine-1' });
      prisma.routine.update.mockResolvedValue({ id: 'routine-1', deletedAt: new Date() });

      const res = await service.remove('user-1', 'routine-1');
      expect(prisma.routine.update).toHaveBeenCalledWith({
        where: { id: 'routine-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
