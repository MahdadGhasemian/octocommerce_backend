import { MaterialUnit } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    enum: MaterialUnit,
    default: MaterialUnit.DEVICE,
    required: true,
  })
  @IsEnum(MaterialUnit)
  unit: MaterialUnit;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  order_item_id: number;
}
