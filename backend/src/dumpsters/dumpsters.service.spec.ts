import { Test, TestingModule } from '@nestjs/testing';
import { DumpstersService } from './dumpsters.service';
import { DumpstersRepository } from './repositories/dumpsters.repository';
import { NotFoundException } from '@nestjs/common';

describe('DumpstersService', () => {
  let service: DumpstersService;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DumpstersService,
        { provide: DumpstersRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<DumpstersService>(DumpstersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to repository create', async () => {
      const dto = { serialNumber: '123', color: 'Red' };
      mockRepository.create.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should parse string boolean and delegate to repository', async () => {
      mockRepository.findAll.mockResolvedValue([]);
      await service.findAll('123', 'true');
      expect(mockRepository.findAll).toHaveBeenCalledWith('123', true);

      await service.findAll(undefined, 'false');
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined, false);

      await service.findAll();
      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should return dumpster if found', async () => {
      const dumpster = { id: 1, serialNumber: '123' };
      mockRepository.findUnique.mockResolvedValue(dumpster);

      const result = await service.findOne(1);
      expect(result).toEqual(dumpster);
    });

    it('should throw NotFoundException if not found', async () => {
      mockRepository.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should delegate to repository update', async () => {
      const dto = { color: 'Blue' };
      mockRepository.update.mockResolvedValue({ id: 1, color: 'Blue' });

      const result = await service.update(1, dto);
      expect(result).toEqual({ id: 1, color: 'Blue' });
      expect(mockRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });
});
