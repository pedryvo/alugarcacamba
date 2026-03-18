import { Module } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalsRepository } from './repositories/rentals.repository';
import { DumpstersModule } from '../dumpsters/dumpsters.module';

@Module({
  imports: [DumpstersModule],
  providers: [RentalsService, RentalsRepository],
  controllers: [RentalsController],
  exports: [RentalsService],
})
export class RentalsModule {}
