import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { ProposalStatus, ApprovalAction } from '@prisma/client';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CollaborationGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private prisma: PrismaService) {}

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.join(`room:${data.roomId}`);
    return { event: 'join_room', status: 'success', roomId: data.roomId };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    client.leave(`room:${data.roomId}`);
    return { event: 'leave_room', status: 'success', roomId: data.roomId };
  }

  @SubscribeMessage('location_share')
  handleLocationShare(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; lat: number; lng: number },
  ) {
    client.to(`room:${data.roomId}`).emit('location_shared', {
      userId: data.userId,
      lat: data.lat,
      lng: data.lng,
    });
    return { status: 'broadcasted' };
  }

  @SubscribeMessage('time_proposal')
  async handleTimeProposal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; proposedTime: string; proposedDuration: number },
  ) {
    // Create database entry for proposal
    const proposal = await this.prisma.scheduleProposal.create({
      data: {
        userId: data.userId,
        status: ProposalStatus.PENDING,
        reason: `Proposed slot: ${data.proposedTime} (${data.proposedDuration} mins)`,
      },
    });

    this.server.to(`room:${data.roomId}`).emit('time_proposed', {
      proposalId: proposal.id,
      proposedTime: data.proposedTime,
      proposedDuration: data.proposedDuration,
      userId: data.userId,
    });

    return { status: 'created', proposalId: proposal.id };
  }

  @SubscribeMessage('vote_proposal')
  async handleVoteProposal(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; proposalId: string; userId: string; action: 'APPROVE' | 'REJECT' },
  ) {
    const action = data.action === 'APPROVE' ? ApprovalAction.APPROVE : ApprovalAction.REJECT;

    // Create database entry for vote
    const vote = await this.prisma.scheduleApproval.create({
      data: {
        proposalId: data.proposalId,
        userId: data.userId,
        action,
      },
    });

    // Tally votes
    const allVotes = await this.prisma.scheduleApproval.findMany({
      where: { proposalId: data.proposalId },
    });

    const approvals = allVotes.filter((v) => v.action === ApprovalAction.APPROVE).length;
    const rejections = allVotes.filter((v) => v.action === ApprovalAction.REJECT).length;

    this.server.to(`room:${data.roomId}`).emit('vote_recorded', {
      proposalId: data.proposalId,
      userId: data.userId,
      action: data.action,
      tally: { approvals, rejections },
    });

    return { status: 'voted', approvals, rejections };
  }

  @SubscribeMessage('proposal_status')
  async handleProposalStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; proposalId: string; status: 'APPROVED' | 'REJECTED' },
  ) {
    const status = data.status === 'APPROVED' ? ProposalStatus.APPROVED : ProposalStatus.REJECTED;

    const updated = await this.prisma.scheduleProposal.update({
      where: { id: data.proposalId },
      data: { status },
    });

    // Check conflict detection (e.g. if approved time clashes with existing items)
    const hasConflict = false; // Mock conflict evaluation

    this.server.to(`room:${data.roomId}`).emit('proposal_status_updated', {
      proposalId: data.proposalId,
      status: updated.status,
      hasConflict,
    });

    return { status: updated.status, hasConflict };
  }
}
