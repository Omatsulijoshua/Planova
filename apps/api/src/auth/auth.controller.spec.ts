import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: any;

  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ id: '1', email: 'test@planova.ai' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'access', refreshToken: 'refresh' }),
    refreshToken: jest.fn(),
    logout: jest.fn(),
    logoutAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = { email: 'test@planova.ai', password: 'password123' };
      const res = await controller.register(dto);
      expect(res).toEqual({ id: '1', email: 'test@planova.ai' });
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });
});
