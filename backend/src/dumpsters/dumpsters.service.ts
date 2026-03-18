import { Injectable, NotFoundException } from '@nestjs/common';
import { DumpstersRepository } from './repositories/dumpsters.repository';
import { CreateDumpsterDto, UpdateDumpsterDto } from './dto/dumpster.dto';
import { Dumpster } from '../types';

@Injectable()
export class DumpstersService {
  constructor(private dumpstersRepository: DumpstersRepository) {}

  async create(createDumpsterDto: CreateDumpsterDto): Promise<Dumpster> {
    return this.dumpstersRepository.create(createDumpsterDto);
  }

  async findAll(serialNumber?: string, isRented?: string): Promise<Dumpster[]> {
    const isRentedBool = isRented !== undefined ? isRented === 'true' : undefined;
    return this.dumpstersRepository.findAll(serialNumber, isRentedBool);
  }

  async findOne(id: number): Promise<Dumpster> {
    const dumpster = await this.dumpstersRepository.findUnique(id);
    if (!dumpster) throw new NotFoundException('Dumpster not found');
    return dumpster;
  }

  async update(id: number, updateDumpsterDto: UpdateDumpsterDto): Promise<Dumpster> {
    // Ensure it exists first? (Repository findUnique could be used here if needed)
    return this.dumpstersRepository.update(id, updateDumpsterDto);
  }
}
