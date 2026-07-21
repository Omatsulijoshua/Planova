import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: any;

  const mockFeedbackService = {
    submitFeedback: jest.fn().mockResolvedValue({ id: 'ticket-1' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        { provide: FeedbackService, useValue: mockFeedbackService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('submitFeedback', () => {
    it('should call feedbackService.submitFeedback', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const dto = { rating: 5, comment: 'Nice work', type: 'FEATURE_REQUEST' };
      const res = await controller.submitFeedback(req, dto);
      expect(res).toEqual({ id: 'ticket-1' });
      expect(service.submitFeedback).toHaveBeenCalledWith('user-1', dto);
    });
  });
});
