import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  quantity: number;
}
