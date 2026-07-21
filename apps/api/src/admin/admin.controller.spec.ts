import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;
  let service: any;

  const mockAdminService = {
    getUsers: jest.fn().mockResolvedValue([]),
    getPlans: jest.fn().mockResolvedValue([]),
    getLogs: jest.fn().mockResolvedValue([]),
    toggleMaintenance: jest.fn().mockResolvedValue({ value: 'true' }),
    toggleFeatureFlag: jest.fn().mockResolvedValue({ isEnabled: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should call adminService.getUsers', async () => {
      const res = await controller.getUsers();
      expect(res).toEqual([]);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });

  describe('getPlans', () => {
    it('should call adminService.getPlans', async () => {
      const res = await controller.getPlans();
      expect(res).toEqual([]);
      expect(service.getPlans).toHaveBeenCalled();
    });
  });

  describe('getLogs', () => {
    it('should call adminService.getLogs with filters', async () => {
      const res = await controller.getLogs('auth');
      expect(res).toEqual([]);
      expect(service.getLogs).toHaveBeenCalledWith('auth');
    });
  });

  describe('toggleMaintenance', () => {
    it('should call adminService.toggleMaintenance', async () => {
      const res = await controller.toggleMaintenance();
      expect(res).toEqual({ value: 'true' });
      expect(service.toggleMaintenance).toHaveBeenCalled();
    });
  });

  describe('toggleFeatureFlag', () => {
    it('should call adminService.toggleFeatureFlag', async () => {
      const res = await controller.toggleFeatureFlag('flag-1');
      expect(res).toEqual({ isEnabled: true });
      expect(service.toggleFeatureFlag).toHaveBeenCalledWith('flag-1');
    });
  });
});
