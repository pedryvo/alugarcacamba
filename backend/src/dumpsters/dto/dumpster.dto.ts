import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDumpsterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;
}

export class UpdateDumpsterDto {
  @ApiProperty({ required: false })
  serialNumber?: string;

  @ApiProperty({ required: false })
  color?: string;
}
