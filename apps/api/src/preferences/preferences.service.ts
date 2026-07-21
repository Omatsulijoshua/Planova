import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const preferences = await this.prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      throw new NotFoundException('User preferences not found');
    }

    return preferences;
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const preferences = await tx.userPreference.upsert({
        where: { userId },
        update: {
          timezone: dto.timezone,
          wakeTime: dto.wakeTime,
          sleepTime: dto.sleepTime,
          workDays: dto.workDays,
          schoolDays: dto.schoolDays,
          preferredStudyTime: dto.preferredStudyTime,
          preferredFocusTime: dto.preferredFocusTime,
          breakDuration: dto.breakDuration,
          travelPadding: dto.travelPadding,
          prayerTimesEnabled: dto.prayerTimesEnabled,
          controlMode: dto.controlMode,
          maxTaskMovementWindow: dto.maxTaskMovementWindow,
        },
        create: {
          userId,
          timezone: dto.timezone || 'UTC',
          wakeTime: dto.wakeTime || '07:00',
          sleepTime: dto.sleepTime || '23:00',
          workDays: dto.workDays || [],
          schoolDays: dto.schoolDays || [],
          preferredStudyTime: dto.preferredStudyTime,
          preferredFocusTime: dto.preferredFocusTime,
          breakDuration: dto.breakDuration ?? 15,
          travelPadding: dto.travelPadding ?? 15,
          prayerTimesEnabled: dto.prayerTimesEnabled ?? false,
          controlMode: dto.controlMode || 'SUGGEST',
          maxTaskMovementWindow: dto.maxTaskMovementWindow ?? 24,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'preferences:update',
          resource: 'UserPreference',
          resourceId: preferences.id,
        },
      });

      return preferences;
    });
  }
}
