import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSpecificationDto {
  @ApiProperty({
    example: '1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiProperty({
    type: String,
    example: 'ظرفیت',
    required: false,
  })
  @IsString()
  @IsOptional()
  key: string;

  @ApiProperty({
    type: String,
    example: '100 میکرو فاراد',
    required: false,
  })
  @IsString()
  @IsOptional()
  value: string;

  @ApiProperty({
    type: String,
    example: 'Capacitance',
    required: true,
  })
  @IsString()
  key_2: string;

  @ApiProperty({
    type: String,
    example: '100uF',
    required: true,
  })
  @IsString()
  value_2: string;
}
