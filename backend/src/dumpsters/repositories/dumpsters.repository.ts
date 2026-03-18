import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Dumpster } from '../../types';
import { CreateDumpsterDto, UpdateDumpsterDto } from '../dto/dumpster.dto';

@Injectable()
export class DumpstersRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateDumpsterDto): Promise<Dumpster> {
    const dumpster = await this.prisma.dumpster.create({
      data,
    });
    return dumpster as Dumpster;
  }

  async findAll(serialNumber?: string, isRented?: boolean): Promise<Dumpster[]> {
    const data = await this.prisma.dumpster.findMany({
      where: {
        AND: [
          serialNumber ? { serialNumber: { contains: serialNumber } } : {},
          isRented !== undefined ? { isRented } : {},
        ],
      },
    });
    return data as Dumpster[];
  }

  async findUnique(id: number): Promise<Dumpster | null> {
    const dumpster = await this.prisma.dumpster.findUnique({
      where: { id },
      include: { rentals: true },
    });
    return dumpster as Dumpster | null;
  }

  async update(id: number, data: UpdateDumpsterDto): Promise<Dumpster> {
    const dumpster = await this.prisma.dumpster.update({
      where: { id },
      data,
    });
    return dumpster as Dumpster;
  }
}
