import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from './rentals.controller';
import { RentalsService } from './rentals.service';

describe('RentalsController', () => {
  let controller: RentalsController;

  const mockRentalsService = {
    create: jest.fn(),
    findByDumpster: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        { provide: RentalsService, useValue: mockRentalsService },
      ],
    }).compile();

    controller = module.get<RentalsController>(RentalsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a rental', async () => {
      const dto = { 
        dumpsterId: 1, 
        street: 'A', 
        neighborhood: 'B', 
        city: 'C', 
        zipCode: '123', 
        startDate: new Date(), 
        endDate: new Date() 
      };
      mockRentalsService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockRentalsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findByDumpster', () => {
    it('should find rentals by dumpster id', async () => {
      mockRentalsService.findByDumpster.mockResolvedValue([]);
      await controller.findByDumpster('1');
      expect(mockRentalsService.findByDumpster).toHaveBeenCalledWith(1);
    });
  });
});
