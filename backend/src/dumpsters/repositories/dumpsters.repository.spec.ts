import { Test, TestingModule } from '@nestjs/testing';
import { DumpstersRepository } from './dumpsters.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { MockContext, createMockContext } from '../../prisma/prisma.mock';
import { Dumpster, Rental } from '@prisma/client';

describe('DumpstersRepository', () => {
  let repository: DumpstersRepository;
  let mockCtx: MockContext;

  beforeEach(async () => {
    mockCtx = createMockContext();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DumpstersRepository,
        { provide: PrismaService, useValue: mockCtx.prisma },
      ],
    }).compile();

    repository = module.get<DumpstersRepository>(DumpstersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a dumpster', async () => {
      const dto = { serialNumber: 'ABC-123', color: 'Verde' };
      const dumpster = { id: 1, ...dto, isRented: false };
      mockCtx.prisma.dumpster.create.mockResolvedValue(dumpster as Dumpster);

      const result = await repository.create(dto);
      expect(result).toEqual(dumpster);
      expect(mockCtx.prisma.dumpster.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of dumpsters with no filters', async () => {
      const dumpsters = [{ id: 1, serialNumber: 'ABC' }];
      mockCtx.prisma.dumpster.findMany.mockResolvedValue(dumpsters as Dumpster[]);

      const result = await repository.findAll();
      expect(result).toEqual(dumpsters);
      expect(mockCtx.prisma.dumpster.findMany).toHaveBeenCalledWith({
        where: { AND: [{}, {}] },
      });
    });

    it('should apply filters correctly', async () => {
      mockCtx.prisma.dumpster.findMany.mockResolvedValue([]);
      await repository.findAll('ABC', true);
      expect(mockCtx.prisma.dumpster.findMany).toHaveBeenCalledWith({
        where: {
          AND: [
            { serialNumber: { contains: 'ABC' } },
            { isRented: true },
          ],
        },
      });
    });
  });

  describe('findUnique', () => {
    it('should return a dumpster by id including rentals', async () => {
      const dumpster = { id: 1, serialNumber: 'ABC', rentals: [] };
      mockCtx.prisma.dumpster.findUnique.mockResolvedValue(dumpster as unknown as Dumpster & { rentals: Rental[] });

      const result = await repository.findUnique(1);
      expect(result).toEqual(dumpster);
      expect(mockCtx.prisma.dumpster.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { rentals: true },
      });
    });
  });

  describe('update', () => {
    it('should update a dumpster', async () => {
      const dto = { color: 'Blue' };
      const dumpster = { id: 1, serialNumber: 'ABC', color: 'Blue' };
      mockCtx.prisma.dumpster.update.mockResolvedValue(dumpster as Dumpster);

      const result = await repository.update(1, dto);
      expect(result).toEqual(dumpster);
      expect(mockCtx.prisma.dumpster.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: dto,
      });
    });
  });
});
