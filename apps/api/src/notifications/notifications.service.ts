import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async registerDevice(userId: string, dto: RegisterDeviceDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const device = await tx.userDevice.upsert({
        where: { fcmToken: dto.fcmToken },
        update: {
          userId,
          platform: dto.platform,
          appVersion: dto.appVersion,
        },
        create: {
          userId,
          fcmToken: dto.fcmToken,
          platform: dto.platform,
          appVersion: dto.appVersion,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'notification:register',
          resource: 'UserDevice',
          resourceId: device.id,
        },
      });

      return device;
    });
  }

  async sendTestNotification(userId: string, title: string, body: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const deviceCount = user.devices.length;

    // In production, we trigger FCM/APNS dispatching here.
    // For development, we return a mock success summary.
    await this.prisma.auditLog.create({
      data: {
        userId,
        action: 'notification:sent',
        resource: 'User',
        resourceId: userId,
      },
    });

    return {
      success: true,
      devicesNotified: deviceCount,
      sentTitle: title,
      sentBody: body,
      timestamp: new Date(),
    };
  }
}
