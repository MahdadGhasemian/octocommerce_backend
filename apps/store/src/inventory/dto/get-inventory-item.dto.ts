import { MaterialUnit } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class GetInventoryItemDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id: number;

  @ApiProperty({
    enum: MaterialUnit,
    default: MaterialUnit.DEVICE,
    required: true,
  })
  @IsEnum(MaterialUnit)
  @Expose()
  unit: MaterialUnit;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  quantity: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  description: string;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  order_item_id: number;

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
  warehouse_from_id?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  warehouse_to_id?: number;
}
