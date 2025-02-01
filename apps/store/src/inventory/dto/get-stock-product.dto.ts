import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetStockProductDto {
  @ApiProperty({
    example: 100,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  quantity?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(0)
  @Expose()
  available_quantity: number;
}
