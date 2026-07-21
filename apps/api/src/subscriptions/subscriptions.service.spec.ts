import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    subscriptionPlan: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    subscription: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('subscribe', () => {
    it('should create new subscription under trial successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.subscriptionPlan.findUnique.mockResolvedValue({ id: 'plan-pro', code: 'pro' });
      prisma.subscription.upsert.mockResolvedValue({ id: 'sub-1', status: SubscriptionStatus.TRIALING });

      const res = await service.subscribe('user-1', { planCode: 'pro' });
      expect(res.status).toBe(SubscriptionStatus.TRIALING);
      expect(prisma.subscription.upsert).toHaveBeenCalled();
    });
  });

  describe('getStatus with trial and grace checks', () => {
    it('should grant access and return remaining days if trial is still active', async () => {
      const now = new Date();
      const future = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days left
      prisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        status: SubscriptionStatus.TRIALING,
        endDate: future,
        plan: { code: 'pro' },
      });

      const res = await service.getStatus('user-1');
      expect(res.hasAccess).toBe(true);
      expect(res.trialDaysLeft).toBe(5);
      expect(res.features.advancedAi).toBe(true);
    });

    it('should grant access if status is active', async () => {
      prisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        status: SubscriptionStatus.ACTIVE,
        endDate: new Date(),
        plan: { code: 'pro' },
      });

      const res = await service.getStatus('user-1');
      expect(res.hasAccess).toBe(true);
      expect(res.features.advancedAi).toBe(true);
    });

    it('should flag status as grace period if renewal past due is under 7 days', async () => {
      const now = new Date();
      const pastEndDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // failed 2 days ago
      prisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        status: SubscriptionStatus.PAST_DUE,
        endDate: pastEndDate,
        plan: { code: 'pro' },
      });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1' });

      const res = await service.getStatus('user-1');
      expect(res.hasAccess).toBe(true);
      expect(res.status).toBe(SubscriptionStatus.GRACE_PERIOD);
    });

    it('should deny access if renewal past due is over 7 days', async () => {
      const now = new Date();
      const oldEndDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // failed 10 days ago
      prisma.subscription.findUnique.mockResolvedValue({
        id: 'sub-1',
        status: SubscriptionStatus.PAST_DUE,
        endDate: oldEndDate,
        plan: { code: 'pro' },
      });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1' });

      const res = await service.getStatus('user-1');
      expect(res.hasAccess).toBe(false);
      expect(res.status).toBe(SubscriptionStatus.UNPAID);
    });
  });

  describe('simulatePaymentWebhook', () => {
    it('should extend plan on payment success', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ id: 'sub-1', endDate: new Date() });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1', status: SubscriptionStatus.ACTIVE });

      const res = await service.simulatePaymentWebhook('user-1', true);
      expect(res.status).toBe(SubscriptionStatus.ACTIVE);
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should move to grace period on payment failure', async () => {
      prisma.subscription.findUnique.mockResolvedValue({ id: 'sub-1', endDate: new Date() });
      prisma.subscription.update.mockResolvedValue({ id: 'sub-1', status: SubscriptionStatus.GRACE_PERIOD });

      const res = await service.simulatePaymentWebhook('user-1', false);
      expect(res.status).toBe(SubscriptionStatus.GRACE_PERIOD);
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });
  });
});
