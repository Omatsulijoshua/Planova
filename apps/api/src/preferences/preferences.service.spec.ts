import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesService } from './preferences.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PreferencesService', () => {
  let service: PreferencesService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    userPreference: {
      findUnique: jest.fn(),
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
        PreferencesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PreferencesService>(PreferencesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPreferences', () => {
    it('should return preferences if they exist', async () => {
      const mockPref = { id: 'pref-1', userId: 'user-1', timezone: 'UTC' };
      prisma.userPreference.findUnique.mockResolvedValue(mockPref);

      const result = await service.getPreferences('user-1');
      expect(result).toEqual(mockPref);
      expect(prisma.userPreference.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-1' } });
    });

    it('should throw NotFoundException if preferences do not exist', async () => {
      prisma.userPreference.findUnique.mockResolvedValue(null);

      await expect(service.getPreferences('user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      const mockPref = { id: 'pref-1', userId: 'user-1', timezone: 'Africa/Lagos' };
      prisma.userPreference.upsert.mockResolvedValue(mockPref);

      const result = await service.updatePreferences('user-1', {
        timezone: 'Africa/Lagos',
      });

      expect(result).toEqual(mockPref);
      expect(prisma.userPreference.upsert).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.updatePreferences('user-1', { timezone: 'Africa/Lagos' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
