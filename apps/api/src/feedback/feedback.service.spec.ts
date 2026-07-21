import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: any;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    supportTicket: {
      create: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('submitFeedback', () => {
    it('should submit feedback and save support ticket successfully', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.supportTicket.create.mockResolvedValue({
        id: 'ticket-1',
        subject: 'Feedback: TIMETABLE_QUALITY',
        description: 'Rating: 5 Stars. Comment: Great job!',
        status: 'OPEN',
      });

      const res = await service.submitFeedback('user-1', {
        rating: 5,
        comment: 'Great job!',
        type: 'TIMETABLE_QUALITY',
      });

      expect(res.id).toBe('ticket-1');
      expect(prisma.supportTicket.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          subject: 'Feedback: TIMETABLE_QUALITY',
          description: 'Rating: 5 Stars. Comment: Great job!',
          status: 'OPEN',
        },
      });
      expect(prisma.auditLog.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.submitFeedback('user-1', {
          rating: 4,
          comment: 'Not bad',
          type: 'BUG_REPORT',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
