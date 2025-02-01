import { MaterialUnit } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { GetInventoryDto } from './get-inventory.dto';
import { GetWarehouseDto } from './get-warehouse.dto';

export class GetInventoryItemDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @Expose()
  id?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  warehouse_id?: number;

  @ApiProperty({
    type: GetWarehouseDto,
    required: false,
  })
  @Type(() => GetWarehouseDto)
  @Expose()
  warehouse: GetWarehouseDto;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  warehouse_from_id?: number;

  @ApiProperty({
    type: GetWarehouseDto,
    required: false,
  })
  @Type(() => GetWarehouseDto)
  @Expose()
  warehouse_from: GetWarehouseDto;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  warehouse_to_id?: number;

  @ApiProperty({
    type: GetWarehouseDto,
    required: false,
  })
  @Type(() => GetWarehouseDto)
  @Expose()
  warehouse_to: GetWarehouseDto;

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
  @IsString()
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
    type: GetInventoryDto,
    required: false,
  })
  @Type(() => GetInventoryDto)
  @Expose()
  inventory: GetInventoryDto;
}
