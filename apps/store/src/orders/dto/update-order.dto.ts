import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    type: Date,
    required: false,
  })
  @IsDateString()
  @IsOptional()
  delivery_date?: Date;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount_percentage?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
