import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async submitFeedback(userId: string, dto: CreateFeedbackDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const ticket = await tx.supportTicket.create({
        data: {
          userId,
          subject: `Feedback: ${dto.type}`,
          description: `Rating: ${dto.rating} Stars. Comment: ${dto.comment}`,
          status: 'OPEN',
        },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: 'feedback:submit',
          resource: 'SupportTicket',
          resourceId: ticket.id,
        },
      });

      return ticket;
    });
  }
}
