import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/rental.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Rental } from '../types';

@ApiTags('rentals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Rent a dumpster' })
  create(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalsService.create(createRentalDto);
  }

  @Get('dumpster/:id')
  @ApiOperation({ summary: 'Get rental history for a dumpster' })
  findByDumpster(@Param('id') id: string): Promise<Rental[]> {
    return this.rentalsService.findByDumpster(+id);
  }
}
