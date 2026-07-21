import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
    },
    subscriptionPlan: {
      findMany: jest.fn(),
    },
    auditLog: {
      findMany: jest.fn(),
    },
    appSetting: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    featureFlag: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return user selection', async () => {
      prisma.user.findMany.mockResolvedValue([
        {
          id: 'user-1',
          email: 'test@planova.com',
          userRoles: [{ role: { name: 'ADMIN' } }],
          createdAt: new Date(),
        },
      ]);
      const res = await service.getUsers();
      expect(res.length).toBe(1);
      expect(res[0].role).toBe('ADMIN');
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('getPlans', () => {
    it('should return subscription plans lists', async () => {
      prisma.subscriptionPlan.findMany.mockResolvedValue([{ id: 'plan-pro', price: 4.99 }]);
      const res = await service.getPlans();
      expect(res[0].price).toBe(4.99);
    });
  });

  describe('getLogs', () => {
    it('should load audit logs applying filters', async () => {
      prisma.auditLog.findMany.mockResolvedValue([{ id: 'log-1', action: 'auth:login' }]);
      const res = await service.getLogs('auth');
      expect(res[0].action).toBe('auth:login');
      expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { action: { contains: 'auth', mode: 'insensitive' } },
            { resource: { contains: 'auth', mode: 'insensitive' } },
          ],
        },
        include: { user: { select: { email: true } } },
        orderBy: { timestamp: 'desc' },
        take: 100,
      });
    });
  });

  describe('toggleMaintenance', () => {
    it('should toggle from false to true', async () => {
      prisma.appSetting.findUnique.mockResolvedValue(null); // defaults to false
      prisma.appSetting.upsert.mockResolvedValue({ key: 'maintenance_mode', value: 'true' });

      const res = await service.toggleMaintenance();
      expect(res.value).toBe('true');
      expect(prisma.appSetting.upsert).toHaveBeenCalledWith({
        where: { key: 'maintenance_mode' },
        update: { value: 'true' },
        create: { key: 'maintenance_mode', value: 'true' },
      });
    });

    it('should toggle from true to false', async () => {
      prisma.appSetting.findUnique.mockResolvedValue({ key: 'maintenance_mode', value: 'true' });
      prisma.appSetting.upsert.mockResolvedValue({ key: 'maintenance_mode', value: 'false' });

      const res = await service.toggleMaintenance();
      expect(res.value).toBe('false');
      expect(prisma.appSetting.upsert).toHaveBeenCalledWith({
        where: { key: 'maintenance_mode' },
        update: { value: 'false' },
        create: { key: 'maintenance_mode', value: 'false' },
      });
    });
  });

  describe('toggleFeatureFlag', () => {
    it('should toggle features and return updated flag', async () => {
      prisma.featureFlag.findUnique.mockResolvedValue({ id: 'flag-1', isEnabled: false });
      prisma.featureFlag.update.mockResolvedValue({ id: 'flag-1', isEnabled: true });

      const res = await service.toggleFeatureFlag('flag-1');
      expect(res.isEnabled).toBe(true);
      expect(prisma.featureFlag.update).toHaveBeenCalledWith({
        where: { id: 'flag-1' },
        data: { isEnabled: true },
      });
    });

    it('should throw NotFoundException if flag does not exist', async () => {
      prisma.featureFlag.findUnique.mockResolvedValue(null);

      await expect(service.toggleFeatureFlag('flag-1')).rejects.toThrow(NotFoundException);
    });
  });
});
