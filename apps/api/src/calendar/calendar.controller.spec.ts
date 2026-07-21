import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: any;

  const mockCalendarService = {
    connectCalendar: jest.fn().mockResolvedValue({ url: 'https://oauth.google.com' }),
    syncCalendar: jest.fn().mockResolvedValue({ success: true, itemsSynced: 5 }),
    getSyncHistory: jest.fn().mockResolvedValue([{ id: 'log-1', status: 'SUCCESS' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        { provide: CalendarService, useValue: mockCalendarService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<CalendarController>(CalendarController);
    service = module.get<CalendarService>(CalendarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('connectCalendar', () => {
    it('should call calendarService.connectCalendar', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.connectCalendar(req, 'google');
      expect(res).toEqual({ url: 'https://oauth.google.com' });
      expect(service.connectCalendar).toHaveBeenCalledWith('user-1', 'google');
    });
  });

  describe('syncCalendar', () => {
    it('should call calendarService.syncCalendar', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.syncCalendar(req);
      expect(res).toEqual({ success: true, itemsSynced: 5 });
      expect(service.syncCalendar).toHaveBeenCalledWith('user-1');
    });
  });

  describe('getSyncHistory', () => {
    it('should call calendarService.getSyncHistory', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.getSyncHistory(req);
      expect(res).toEqual([{ id: 'log-1', status: 'SUCCESS' }]);
      expect(service.getSyncHistory).toHaveBeenCalledWith('user-1');
    });
  });
});
