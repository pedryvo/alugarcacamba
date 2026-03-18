import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from './repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersRepository = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: mockUsersRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if credentials are valid', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hashedpassword' };
      mockUsersRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);
      
      const result = await service.validateUser('test@test.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password mismatch', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hashedpassword' };
      mockUsersRepository.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@test.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: 1, email: 'test@test.com' };
      mockJwtService.sign.mockReturnValue('mockToken');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'mockToken' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'test@test.com', sub: 1 });
    });
  });
});
