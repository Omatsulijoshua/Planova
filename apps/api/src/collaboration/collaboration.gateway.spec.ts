import { Test, TestingModule } from '@nestjs/testing';
import { CollaborationGateway } from './collaboration.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { ProposalStatus, ApprovalAction } from '@prisma/client';

describe('CollaborationGateway', () => {
  let gateway: CollaborationGateway;
  let prisma: any;

  const mockPrismaService = {
    scheduleProposal: {
      create: jest.fn(),
      update: jest.fn(),
    },
    scheduleApproval: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockSocket = {
    join: jest.fn(),
    leave: jest.fn(),
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  } as any;

  const mockServer = {
    to: jest.fn().mockReturnThis(),
    emit: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaborationGateway,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    gateway = module.get<CollaborationGateway>(CollaborationGateway);
    prisma = module.get<PrismaService>(PrismaService);
    gateway.server = mockServer;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleJoinRoom', () => {
    it('should join the websocket room successfully', () => {
      const res = gateway.handleJoinRoom(mockSocket, { roomId: 'room-1' });
      expect(mockSocket.join).toHaveBeenCalledWith('room:room-1');
      expect(res.roomId).toBe('room-1');
    });
  });

  describe('handleLeaveRoom', () => {
    it('should leave the websocket room successfully', () => {
      const res = gateway.handleLeaveRoom(mockSocket, { roomId: 'room-1' });
      expect(mockSocket.leave).toHaveBeenCalledWith('room:room-1');
      expect(res.roomId).toBe('room-1');
    });
  });

  describe('handleLocationShare', () => {
    it('should broadcast location to room members', () => {
      const res = gateway.handleLocationShare(mockSocket, {
        roomId: 'room-1',
        userId: 'user-1',
        lat: 10.5,
        lng: 20.6,
      });
      expect(mockSocket.to).toHaveBeenCalledWith('room:room-1');
      expect(mockSocket.emit).toHaveBeenCalledWith('location_shared', {
        userId: 'user-1',
        lat: 10.5,
        lng: 20.6,
      });
      expect(res.status).toBe('broadcasted');
    });
  });

  describe('handleTimeProposal', () => {
    it('should save proposal to DB and broadcast to room', async () => {
      prisma.scheduleProposal.create.mockResolvedValue({ id: 'proposal-1' });

      const res = await gateway.handleTimeProposal(mockSocket, {
        roomId: 'room-1',
        userId: 'user-1',
        proposedTime: '15:00',
        proposedDuration: 60,
      });

      expect(prisma.scheduleProposal.create).toHaveBeenCalled();
      expect(mockServer.to).toHaveBeenCalledWith('room:room-1');
      expect(mockServer.emit).toHaveBeenCalledWith('time_proposed', {
        proposalId: 'proposal-1',
        proposedTime: '15:00',
        proposedDuration: 60,
        userId: 'user-1',
      });
      expect(res.proposalId).toBe('proposal-1');
    });
  });

  describe('handleVoteProposal', () => {
    it('should record vote in DB and broadcast vote recorded event', async () => {
      prisma.scheduleApproval.create.mockResolvedValue({ id: 'vote-1' });
      prisma.scheduleApproval.findMany.mockResolvedValue([
        { action: ApprovalAction.APPROVE },
        { action: ApprovalAction.REJECT },
      ]);

      const res = await gateway.handleVoteProposal(mockSocket, {
        roomId: 'room-1',
        proposalId: 'proposal-1',
        userId: 'user-2',
        action: 'APPROVE',
      });

      expect(prisma.scheduleApproval.create).toHaveBeenCalled();
      expect(mockServer.to).toHaveBeenCalledWith('room:room-1');
      expect(mockServer.emit).toHaveBeenCalledWith('vote_recorded', {
        proposalId: 'proposal-1',
        userId: 'user-2',
        action: 'APPROVE',
        tally: { approvals: 1, rejections: 1 },
      });
      expect(res.approvals).toBe(1);
    });
  });

  describe('handleProposalStatus', () => {
    it('should update status in DB and broadcast updated status', async () => {
      prisma.scheduleProposal.update.mockResolvedValue({ id: 'proposal-1', status: ProposalStatus.APPROVED });

      const res = await gateway.handleProposalStatus(mockSocket, {
        roomId: 'room-1',
        proposalId: 'proposal-1',
        status: 'APPROVED',
      });

      expect(prisma.scheduleProposal.update).toHaveBeenCalled();
      expect(mockServer.to).toHaveBeenCalledWith('room:room-1');
      expect(mockServer.emit).toHaveBeenCalledWith('proposal_status_updated', {
        proposalId: 'proposal-1',
        status: ProposalStatus.APPROVED,
        hasConflict: false,
      });
      expect(res.status).toBe(ProposalStatus.APPROVED);
    });
  });
});
