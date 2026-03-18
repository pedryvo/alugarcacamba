import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { DumpstersService } from './dumpsters.service';
import { CreateDumpsterDto, UpdateDumpsterDto } from './dto/dumpster.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Dumpster } from '../types';

@ApiTags('dumpsters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dumpsters')
export class DumpstersController {
  constructor(private readonly dumpstersService: DumpstersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new dumpster' })
  create(@Body() createDumpsterDto: CreateDumpsterDto): Promise<Dumpster> {
    return this.dumpstersService.create(createDumpsterDto);
  }

  @Get()
  @ApiOperation({ summary: 'List and filter dumpsters' })
  findAll(
    @Query('serialNumber') serialNumber?: string,
    @Query('isRented') isRented?: string,
  ): Promise<Dumpster[]> {
    return this.dumpstersService.findAll(serialNumber, isRented);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific dumpster with its rental history' })
  findOne(@Param('id') id: string): Promise<Dumpster> {
    return this.dumpstersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a dumpster' })
  update(@Param('id') id: string, @Body() updateDumpsterDto: UpdateDumpsterDto): Promise<Dumpster> {
    return this.dumpstersService.update(+id, updateDumpsterDto);
  }
}
