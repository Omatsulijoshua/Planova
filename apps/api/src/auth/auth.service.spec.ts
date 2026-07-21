import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
    },
    userRole: {
      create: jest.fn(),
    },
    userProfile: {
      create: jest.fn(),
    },
    userPreference: {
      create: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    userSession: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: '1', email: 'test@planova.ai', status: 'ACTIVE' });
      prisma.role.findUnique.mockResolvedValue({ id: 'role-free', name: 'FREE_USER' });

      const result = await service.register({
        email: 'test@planova.ai',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toEqual({ id: '1', email: 'test@planova.ai', status: 'ACTIVE' });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@planova.ai' } });
    });

    it('should throw ConflictException if email is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@planova.ai' });

      await expect(
        service.register({
          email: 'test@planova.ai',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const passwordHash = await argon2.hash('password123');
      prisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@planova.ai',
        passwordHash,
        status: 'ACTIVE',
        userRoles: [{ role: { name: 'FREE_USER' } }],
      });

      const result = await service.login({
        email: 'test@planova.ai',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'mockToken',
        refreshToken: 'mockToken',
      });
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'wrong@planova.ai',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
