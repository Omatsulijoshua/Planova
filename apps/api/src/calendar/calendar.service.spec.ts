import { Test, TestingModule } from '@nestjs/testing';
import { CalendarService } from './calendar.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CalendarService', () => {
  let service: CalendarService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    calendarSyncLog: {
      create: jest.fn(),
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
        CalendarService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('connectCalendar', () => {
    it('should generate a mock OAuth redirect URL', async () => {
      const res = await service.connectCalendar('user-1', 'google');
      expect(res.url).toContain('accounts.google.com');
      expect(res.url).toContain('mock_google_id');
    });
  });

  describe('syncCalendar', () => {
    it('should create a sync log and audit log on successful sync', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.calendarSyncLog.create.mockResolvedValue({ id: 'log-1', status: 'SUCCESS' });

      const res = await service.syncCalendar('user-1');
      expect(res.success).toBe(true);
      expect(prisma.calendarSyncLog.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.syncCalendar('user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSyncHistory', () => {
    it('should fetch sync history records', async () => {
      const mockHistory = [{ id: 'log-1', provider: 'GOOGLE', status: 'SUCCESS' }];
      prisma.calendarSyncLog.findMany.mockResolvedValue(mockHistory);

      const res = await service.getSyncHistory('user-1');
      expect(res).toEqual(mockHistory);
      expect(prisma.calendarSyncLog.findMany).toHaveBeenCalled();
    });
  });
});
