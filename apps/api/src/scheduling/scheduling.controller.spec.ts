import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('SchedulingController', () => {
  let controller: SchedulingController;
  let service: any;

  const mockSchedulingService = {
    optimizeTimetable: jest.fn().mockResolvedValue({ success: true, schedule: [] }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [
        { provide: SchedulingService, useValue: mockSchedulingService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<SchedulingController>(SchedulingController);
    service = module.get<SchedulingService>(SchedulingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('optimize', () => {
    it('should call schedulingService.optimizeTimetable', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.optimize(req);
      expect(res).toEqual({ success: true, schedule: [] });
      expect(service.optimizeTimetable).toHaveBeenCalledWith('user-1');
    });
  });
});
