import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RentalsRepository } from './repositories/rentals.repository';
import { DumpstersRepository } from '../dumpsters/repositories/dumpsters.repository';
import { CreateRentalDto } from './dto/rental.dto';
import { Rental } from '../types';

@Injectable()
export class RentalsService {
  constructor(
    private rentalsRepository: RentalsRepository,
    private dumpstersRepository: DumpstersRepository,
  ) {}

  async create(createRentalDto: CreateRentalDto): Promise<Rental> {
    const dumpster = await this.dumpstersRepository.findUnique(createRentalDto.dumpsterId);

    if (!dumpster) throw new NotFoundException('Dumpster not found');
    if (dumpster.isRented) throw new BadRequestException('Dumpster is already rented');

    return this.rentalsRepository.create(createRentalDto);
  }

  async findByDumpster(dumpsterId: number): Promise<Rental[]> {
    return this.rentalsRepository.findByDumpsterId(dumpsterId);
  }
}
