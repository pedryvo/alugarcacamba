import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Rental } from '../../types';
import { CreateRentalDto } from '../dto/rental.dto';

@Injectable()
export class RentalsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateRentalDto): Promise<Rental> {
    const { dumpsterId, ...rest } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // Create rental
      const rental = await tx.rental.create({
        data: {
          ...rest,
          dumpster: { connect: { id: dumpsterId } },
        },
      });

      // Update dumpster status
      await tx.dumpster.update({
        where: { id: dumpsterId },
        data: { isRented: true },
      });

      return rental as Rental;
    });
  }

  async findByDumpsterId(dumpsterId: number): Promise<Rental[]> {
    const rentals = await this.prisma.rental.findMany({
      where: { dumpsterId },
      orderBy: { startDate: 'desc' },
    });
    return rentals as Rental[];
  }
}
