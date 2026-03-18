import { Test, TestingModule } from '@nestjs/testing';
import { DumpstersService } from './dumpsters.service';

describe('DumpstersService', () => {
  let service: DumpstersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DumpstersService],
    }).compile();

    service = module.get<DumpstersService>(DumpstersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
