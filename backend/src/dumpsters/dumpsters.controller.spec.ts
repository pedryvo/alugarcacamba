import { Test, TestingModule } from '@nestjs/testing';
import { DumpstersController } from './dumpsters.controller';

describe('DumpstersController', () => {
  let controller: DumpstersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DumpstersController],
    }).compile();

    controller = module.get<DumpstersController>(DumpstersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
