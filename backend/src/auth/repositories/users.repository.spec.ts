import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { MockContext, createMockContext } from '../../prisma/prisma.mock';
import { User } from '@prisma/client';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hash' };
      mockCtx.prisma.user.findUnique.mockResolvedValue(user as unknown as User);

      const result = await repository.findByEmail('test@example.com');
      expect(result).toEqual(user);
      expect(mockCtx.prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if not found', async () => {
      mockCtx.prisma.user.findUnique.mockResolvedValue(null);
      const result = await repository.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hash' };
      mockCtx.prisma.user.findUnique.mockResolvedValue(user as unknown as User);

      const result = await repository.findById(1);
      expect(result).toEqual(user);
    });
  });
});
