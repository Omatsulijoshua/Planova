import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('PreferencesController', () => {
  let controller: PreferencesController;
  let service: any;

  const mockPreferencesService = {
    getPreferences: jest.fn().mockResolvedValue({ id: 'pref-1', timezone: 'UTC' }),
    updatePreferences: jest.fn().mockResolvedValue({ id: 'pref-1', timezone: 'EST' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferencesController],
      providers: [
        { provide: PreferencesService, useValue: mockPreferencesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<PreferencesController>(PreferencesController);
    service = module.get<PreferencesService>(PreferencesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPreferences', () => {
    it('should return user preferences', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const res = await controller.getPreferences(req);
      expect(res).toEqual({ id: 'pref-1', timezone: 'UTC' });
      expect(service.getPreferences).toHaveBeenCalledWith('user-1');
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', async () => {
      const req = { user: { userId: 'user-1' } } as any;
      const dto = { timezone: 'EST' };
      const res = await controller.updatePreferences(req, dto);
      expect(res).toEqual({ id: 'pref-1', timezone: 'EST' });
      expect(service.updatePreferences).toHaveBeenCalledWith('user-1', dto);
    });
  });
});
