import { Module } from '@nestjs/common';
import { DumpstersService } from './dumpsters.service';
import { DumpstersController } from './dumpsters.controller';
import { DumpstersRepository } from './repositories/dumpsters.repository';

@Module({
  providers: [DumpstersService, DumpstersRepository],
  controllers: [DumpstersController],
  exports: [DumpstersService, DumpstersRepository],
})
export class DumpstersModule {}
