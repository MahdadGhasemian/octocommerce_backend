import { InventoryType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetInventoryItemDto } from './get-inventory-item.dto';

export class GetInventoryDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  inventory_number?: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  inventory_date?: Date;

  @ApiProperty({
    enum: InventoryType,
    default: InventoryType.INPUT,
    required: true,
  })
  @IsEnum(InventoryType)
  @Expose()
  inventory_type?: InventoryType;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  inventory_description?: string;

  @ApiProperty({
    type: GetInventoryItemDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetInventoryItemDto)
  @Expose()
  inventory_items?: GetInventoryItemDto[];
}
