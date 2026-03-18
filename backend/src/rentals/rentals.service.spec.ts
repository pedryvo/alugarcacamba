import { Test, TestingModule } from '@nestjs/testing';
import { RentalsService } from './rentals.service';
import { RentalsRepository } from './repositories/rentals.repository';
import { DumpstersRepository } from '../dumpsters/repositories/dumpsters.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RentalsService', () => {
  let service: RentalsService;

  const mockRentalsRepository = {
    create: jest.fn(),
    findByDumpsterId: jest.fn(),
  };

  const mockDumpstersRepository = {
    findUnique: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentalsService,
        { provide: RentalsRepository, useValue: mockRentalsRepository },
        { provide: DumpstersRepository, useValue: mockDumpstersRepository },
      ],
    }).compile();

    service = module.get<RentalsService>(RentalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { 
      dumpsterId: 1, 
      street: 'A', 
      neighborhood: 'B', 
      city: 'C', 
      zipCode: '123', 
      startDate: new Date(), 
      endDate: new Date() 
    };

    it('should throw NotFoundException if dumpster does not exist', async () => {
      mockDumpstersRepository.findUnique.mockResolvedValue(null);
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if dumpster is already rented', async () => {
      mockDumpstersRepository.findUnique.mockResolvedValue({ id: 1, isRented: true });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should create rental if dumpster is available', async () => {
      mockDumpstersRepository.findUnique.mockResolvedValue({ id: 1, isRented: false });
      mockRentalsRepository.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockRentalsRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByDumpster', () => {
    it('should delegate to repository', async () => {
      mockRentalsRepository.findByDumpsterId.mockResolvedValue([]);
      await service.findByDumpster(1);
      expect(mockRentalsRepository.findByDumpsterId).toHaveBeenCalledWith(1);
    });
  });
});
