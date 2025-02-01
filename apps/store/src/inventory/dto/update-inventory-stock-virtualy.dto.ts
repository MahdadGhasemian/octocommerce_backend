import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpdateInventoryStockVirtualyDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(0)
  available_quantity: number;
}
