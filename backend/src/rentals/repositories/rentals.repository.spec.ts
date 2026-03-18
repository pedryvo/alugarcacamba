import { Test, TestingModule } from '@nestjs/testing';
import { RentalsRepository } from './rentals.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { MockContext, createMockContext } from '../../prisma/prisma.mock';
import { Rental, Dumpster } from '@prisma/client';

describe('RentalsRepository', () => {
  let repository: RentalsRepository;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    // Mock Prisma transaction to immediately execute the callback with the mocked prisma client
    mockCtx.prisma.$transaction.mockImplementation(async (cb) => {
      // @ts-ignore
      return cb(mockCtx.prisma);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsRepository,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    repository = module.get<RentalsRepository>(RentalsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a rental and update dumpster status', async () => {
      const dto = { 
        dumpsterId: 1, 
        street: 'Street', 
        neighborhood: 'Neighborhood', 
        city: 'City', 
        zipCode: '000000', 
        startDate: new Date(), 
        endDate: new Date() 
      };
      
      const { dumpsterId, ...rest } = dto;
      const rental = { id: 1, ...rest, dumpsterId };

      mockCtx.prisma.rental.create.mockResolvedValue(rental as unknown as Rental);
      mockCtx.prisma.dumpster.update.mockResolvedValue({ id: dumpsterId, isRented: true } as unknown as Dumpster);

      const result = await repository.create(dto);
      
      expect(result).toEqual(rental);
      
      expect(mockCtx.prisma.rental.create).toHaveBeenCalledWith({
        data: {
          ...rest,
          dumpster: { connect: { id: dumpsterId } },
        },
      });

      expect(mockCtx.prisma.dumpster.update).toHaveBeenCalledWith({
        where: { id: dumpsterId },
        data: { isRented: true },
      });
    });
  });

  describe('findByDumpsterId', () => {
    it('should return rentals for a specific dumpster', async () => {
      const rentals = [{ id: 1, dumpsterId: 1 }];
      mockCtx.prisma.rental.findMany.mockResolvedValue(rentals as unknown as Rental[]);

      const result = await repository.findByDumpsterId(1);
      
      expect(result).toEqual(rentals);
      expect(mockCtx.prisma.rental.findMany).toHaveBeenCalledWith({
        where: { dumpsterId: 1 },
        orderBy: { startDate: 'desc' },
      });
    });
  });
});
