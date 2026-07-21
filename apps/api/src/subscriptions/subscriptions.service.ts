import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: string, dto: SubscribeDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 1. Resolve or create subscription plan
    let plan = await this.prisma.subscriptionPlan.findUnique({
      where: { code: dto.planCode },
    });

    if (!plan) {
      // Create default plan if seeding wasn't triggered
      const nameMap: Record<string, string> = {
        free: 'Free Plan',
        student: 'Student Discount',
        pro: 'Premium Plan',
      };
      const priceMap: Record<string, number> = {
        free: 0.00,
        student: 2.99,
        pro: 4.99,
      };

      plan = await this.prisma.subscriptionPlan.create({
        data: {
          name: nameMap[dto.planCode],
          code: dto.planCode,
          price: priceMap[dto.planCode],
          interval: 'month',
          features: {
            advancedAi: dto.planCode !== 'free',
            multiCalendar: dto.planCode !== 'free',
          },
        },
      });
    }

    // 2. Compute date windows (Trial = 14 days, Free = 100 years)
    const now = new Date();
    let endDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days trial
    let initialStatus: SubscriptionStatus = SubscriptionStatus.TRIALING;

    if (dto.planCode === 'free') {
      endDate = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years
      initialStatus = SubscriptionStatus.ACTIVE;
    }

    return this.prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.upsert({
        where: { userId },
        update: {
          planId: plan!.id,
          status: initialStatus,
          startDate: now,
          endDate: endDate,
          paymentGateway: dto.paymentGateway || 'stripe',
        },
        create: {
          userId,
          planId: plan!.id,
          status: initialStatus,
          startDate: now,
          endDate: endDate,
          paymentGateway: dto.paymentGateway || 'stripe',
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'subscription:update',
          resource: 'Subscription',
          resourceId: subscription.id,
        },
      });

      return subscription;
    });
  }

  async getStatus(userId: string) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    if (!sub) {
      return {
        tier: 'free',
        status: SubscriptionStatus.ACTIVE,
        hasAccess: true,
        trialDaysLeft: 0,
        features: {
          advancedAi: false,
          multiCalendar: false,
        },
      };
    }

    const now = new Date();
    let currentStatus = sub.status;
    let hasAccess = false;
    let trialDaysLeft = 0;

    // Check trial expiration
    if (sub.status === SubscriptionStatus.TRIALING) {
      if (sub.endDate.getTime() < now.getTime()) {
        currentStatus = SubscriptionStatus.PAST_DUE;
      } else {
        hasAccess = true;
        const diffTime = sub.endDate.getTime() - now.getTime();
        trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    if (currentStatus === SubscriptionStatus.ACTIVE) {
      hasAccess = true;
    }

    // Grace Period check (7 days access after failed payment)
    if (currentStatus === SubscriptionStatus.PAST_DUE || currentStatus === SubscriptionStatus.GRACE_PERIOD) {
      const gracePeriodEnd = new Date(sub.endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (now.getTime() <= gracePeriodEnd.getTime()) {
        hasAccess = true;
        currentStatus = SubscriptionStatus.GRACE_PERIOD;
      } else {
        currentStatus = SubscriptionStatus.UNPAID;
      }
    }

    // Update status if it resolved to something else
    if (currentStatus !== sub.status) {
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: { status: currentStatus },
      });
    }

    const planCode = sub.plan.code;

    return {
      tier: planCode,
      status: currentStatus,
      hasAccess,
      trialDaysLeft,
      features: {
        advancedAi: (planCode === 'pro' || planCode === 'student') && hasAccess,
        multiCalendar: (planCode === 'pro' || planCode === 'student') && hasAccess,
      },
    };
  }

  async simulatePaymentWebhook(userId: string, success: boolean) {
    const sub = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!sub) {
      throw new NotFoundException('Subscription not found');
    }

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      let nextStatus: SubscriptionStatus = SubscriptionStatus.ACTIVE;
      let newEndDate = sub.endDate;

      if (success) {
        // Extend end date by 30 days
        nextStatus = SubscriptionStatus.ACTIVE;
        newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        // Renewal failed -> place into grace period / past due
        nextStatus = SubscriptionStatus.GRACE_PERIOD;
      }

      const updatedSub = await tx.subscription.update({
        where: { id: sub.id },
        data: {
          status: nextStatus,
          endDate: newEndDate,
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: success ? 'payment:success' : 'payment:fail',
          resource: 'Subscription',
          resourceId: sub.id,
        },
      });

      return updatedSub;
    });
  }
}
