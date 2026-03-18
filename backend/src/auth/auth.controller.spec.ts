import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: (context: ExecutionContext) => true })
    .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return token on successful login', async () => {
      const user = { id: 1, email: 'test@example.com' };
      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue({ access_token: 'token' });

      const dto = { email: 'test@example.com', password: 'password' };
      const result = await controller.login(dto);
      
      expect(result).toEqual({ access_token: 'token' });
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      const dto = { email: 'test@example.com', password: 'wrong' };
      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
