import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    userDevice: {
      upsert: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerDevice', () => {
    it('should register device token successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.userDevice.upsert.mockResolvedValue({ id: 'device-1', fcmToken: 'token-abc' });

      const dto = { fcmToken: 'token-abc', platform: 'android' };
      const res = await service.registerDevice('user-1', dto);
      expect(res.fcmToken).toBe('token-abc');
      expect(prisma.userDevice.upsert).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const dto = { fcmToken: 'token-abc', platform: 'android' };
      await expect(service.registerDevice('user-1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('sendTestNotification', () => {
    it('should send test notification successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1', devices: [{ id: 'device-1' }] });

      const res = await service.sendTestNotification('user-1', 'Hi', 'Hello');
      expect(res.success).toBe(true);
      expect(res.devicesNotified).toBe(1);
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.sendTestNotification('user-1', 'Hi', 'Hello')).rejects.toThrow(NotFoundException);
    });
  });
});
