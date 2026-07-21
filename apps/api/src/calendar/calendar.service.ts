import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async connectCalendar(userId: string, provider: string) {
    // Return mock OAuth redirect URL
    return {
      url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=mock_${provider}_id&redirect_uri=https://api.planova.ai/calendar/callback&response_type=code`,
    };
  }

  async syncCalendar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Ensure a mock calendar account exists to link the log to
    let account = await this.prisma.calendarAccount.findFirst({
      where: { userId },
    });

    if (!account) {
      account = await this.prisma.calendarAccount.create({
        data: {
          userId,
          provider: 'GOOGLE',
          email: user.email,
          accessToken: 'mock_token',
        },
      });
    }

    const syncedItems = Math.floor(Math.random() * 10) + 1;
    const conflicts = Math.random() > 0.8 ? 1 : 0;

    return this.prisma.$transaction(async (tx) => {
      const log = await tx.calendarSyncLog.create({
        data: {
          accountId: account!.id,
          action: 'PULL',
          status: 'SUCCESS',
          eventsProcessed: syncedItems,
          errorMessage: null,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'calendar:sync',
          resource: 'CalendarSyncLog',
          resourceId: log.id,
        },
      });

      return {
        success: true,
        itemsSynced: syncedItems,
        conflictsDetected: conflicts,
        syncLogId: log.id,
      };
    });
  }

  async getSyncHistory(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.calendarSyncLog.findMany({
      where: {
        account: {
          userId,
        },
        timestamp: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
