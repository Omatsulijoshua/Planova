import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: any;

  const mockNotificationsService = {
    registerDevice: jest.fn().mockResolvedValue({ id: 'device-1', fcmToken: 'token-abc' }),
    sendTestNotification: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerDevice', () => {
    it('should call notificationsService.registerDevice', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const dto = { fcmToken: 'token-abc', platform: 'android' };
      const res = await controller.registerDevice(req, dto);
      expect(res).toEqual({ id: 'device-1', fcmToken: 'token-abc' });
      expect(service.registerDevice).toHaveBeenCalledWith('user-1', dto);
    });
  });

  describe('sendTestNotification', () => {
    it('should call notificationsService.sendTestNotification', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.sendTestNotification(req, 'Title', 'Body');
      expect(res).toEqual({ success: true });
      expect(service.sendTestNotification).toHaveBeenCalledWith('user-1', 'Title', 'Body');
    });
  });
});
