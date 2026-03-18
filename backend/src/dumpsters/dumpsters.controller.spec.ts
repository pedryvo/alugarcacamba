import { Test, TestingModule } from '@nestjs/testing';
import { DumpstersController } from './dumpsters.controller';
import { DumpstersService } from './dumpsters.service';

describe('DumpstersController', () => {
  let controller: DumpstersController;

  const mockDumpstersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DumpstersController],
      providers: [
        { provide: DumpstersService, useValue: mockDumpstersService },
      ],
    }).compile();

    controller = module.get<DumpstersController>(DumpstersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create dumpster', async () => {
      const dto = { serialNumber: '123', color: 'Red' };
      mockDumpstersService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockDumpstersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should find all with query params', async () => {
      mockDumpstersService.findAll.mockResolvedValue([]);
      await controller.findAll('123', 'true');
      expect(mockDumpstersService.findAll).toHaveBeenCalledWith('123', 'true');
    });
  });

  describe('findOne', () => {
    it('should find one by id', async () => {
      mockDumpstersService.findOne.mockResolvedValue({ id: 1, serialNumber: '123' });
      await controller.findOne('1');
      expect(mockDumpstersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update by id', async () => {
      const dto = { color: 'Blue' };
      mockDumpstersService.update.mockResolvedValue({ id: 1, color: 'Blue' });
      await controller.update('1', dto);
      expect(mockDumpstersService.update).toHaveBeenCalledWith(1, dto);
    });
  });
});
