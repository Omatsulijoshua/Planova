import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('SubscriptionsController', () => {
  let controller: SubscriptionsController;
  let service: any;

  const mockSubscriptionsService = {
    subscribe: jest.fn().mockResolvedValue({ success: true }),
    getStatus: jest.fn().mockResolvedValue({ tier: 'free' }),
    simulatePaymentWebhook: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionsController],
      providers: [
        { provide: SubscriptionsService, useValue: mockSubscriptionsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<SubscriptionsController>(SubscriptionsController);
    service = module.get<SubscriptionsService>(SubscriptionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('subscribe', () => {
    it('should call subscriptionsService.subscribe', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const dto = { planCode: 'pro' };
      const res = await controller.subscribe(req, dto);
      expect(res).toEqual({ success: true });
      expect(service.subscribe).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('getStatus', () => {
    it('should call subscriptionsService.getStatus', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.getStatus(req);
      expect(res).toEqual({ tier: 'free' });
      expect(service.getStatus).toHaveBeenCalledWith('user-1');
    });
  });

  describe('simulatePayment', () => {
    it('should call subscriptionsService.simulatePaymentWebhook', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.simulatePayment(req, true);
      expect(res).toEqual({ success: true });
      expect(service.simulatePaymentWebhook).toHaveBeenCalledWith('user-1', true);
    });
  });
});
