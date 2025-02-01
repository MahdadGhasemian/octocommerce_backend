import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({
    example: 'Warehouse Number 1',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: false,
    example: true,
  })
  @IsBoolean()
  is_virtualy: boolean;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
