import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetSpecificationDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: String,
    example: 'ظرفیت',
    required: false,
  })
  @IsString()
  @Expose()
  key: string;

  @ApiProperty({
    type: String,
    example: '100 میکرو فاراد',
    required: false,
  })
  @IsString()
  @Expose()
  value: string;

  @ApiProperty({
    type: String,
    example: 'Capacitance',
    required: true,
  })
  @IsString()
  @Expose()
  key_2: string;

  @ApiProperty({
    type: String,
    example: '100uF',
    required: true,
  })
  @IsString()
  @Expose()
  value_2: string;
}
