import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { UserStatus, UserRoleType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email address already registered');
    }

    const hashedPassword = await argon2.hash(dto.password);
    const assignedRole = dto.role || UserRoleType.FREE_USER;

    // Create User, Profile, Preference, and UserRole inside a transaction
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          status: UserStatus.ACTIVE, // Set directly to ACTIVE for onboarding simplicity in development
        },
      });

      await tx.userProfile.create({
        data: {
          userId: user.id,
          firstName: dto.firstName,
          lastName: dto.lastName,
          persona: dto.persona,
        },
      });

      await tx.userPreference.create({
        data: {
          userId: user.id,
          timezone: 'UTC',
          wakeTime: '07:00',
          sleepTime: '23:00',
        },
      });

      // Find role and connect
      const role = await tx.role.findUnique({
        where: { name: assignedRole },
      });

      if (role) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
      }

      return {
        id: user.id,
        email: user.email,
        status: user.status,
      };
    });
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const tokens = await this.generateTokens(user.id, user.email, roles);

    // Track session and refresh token in DB
    await this.prisma.$transaction(async (tx) => {
      const session = await tx.userSession.create({
        data: {
          userId: user.id,
          token: tokens.accessToken,
          ipAddress: ipAddress,
          userAgent: userAgent,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
        },
      });

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'auth:login',
          resource: 'User',
          resourceId: user.id,
          ipAddress: ipAddress,
        },
      });
    });

    return tokens;
  }

  async refreshToken(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: {
          include: {
            userRoles: {
              include: { role: true },
            },
          },
        },
      },
    });

    if (!record || record.isRevoked || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke old token and rotate
    const user = record.user;
    const roles = user.userRoles.map((ur) => ur.role.name);
    const tokens = await this.generateTokens(user.id, user.email, roles);

    await this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: record.id },
        data: { isRevoked: true },
      });

      await tx.refreshToken.create({
        data: {
          userId: user.id,
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    });

    return tokens;
  }

  async logout(token: string) {
    const record = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (record) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { isRevoked: true },
      });
    }
    return { success: true };
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
    return { success: true };
  }

  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'super_secret_access_token_key_change_me',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_token_key_change_me',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
