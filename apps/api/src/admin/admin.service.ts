import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      orderBy: { price: 'asc' },
    });
  }

  async getLogs(filter?: string) {
    return this.prisma.auditLog.findMany({
      where: filter
        ? {
            OR: [
              { action: { contains: filter, mode: 'insensitive' } },
              { resource: { contains: filter, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        user: {
          select: { email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async toggleMaintenance() {
    const setting = await this.prisma.appSetting.findUnique({
      where: { key: 'maintenance_mode' },
    });

    const isEnabled = setting ? setting.value === 'true' : false;
    const nextValue = isEnabled ? 'false' : 'true';

    return this.prisma.appSetting.upsert({
      where: { key: 'maintenance_mode' },
      update: { value: nextValue },
      create: { key: 'maintenance_mode', value: nextValue },
    });
  }

  async toggleFeatureFlag(flagId: string) {
    const flag = await this.prisma.featureFlag.findUnique({
      where: { id: flagId },
    });

    if (!flag) {
      throw new NotFoundException('Feature flag not found');
    }

    return this.prisma.featureFlag.update({
      where: { id: flagId },
      data: { isEnabled: !flag.isEnabled },
    });
  }
}
