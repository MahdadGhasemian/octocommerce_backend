import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetStockDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

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
  @Expose()
  warehouse_id?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  inventory_description?: string;
}
