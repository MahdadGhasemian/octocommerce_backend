import { InventoryType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateInventoryItemDto } from './create-inventory-item.dto';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  inventory_number: number;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsOptional()
  inventory_date: Date;

  @ApiProperty({
    enum: InventoryType,
    default: InventoryType.INPUT,
    required: true,
  })
  @IsEnum(InventoryType)
  inventory_type: InventoryType;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  warehouse_to_id: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  warehouse_from_id: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  inventory_description: string;

  @ApiProperty({
    type: CreateInventoryItemDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateInventoryItemDto)
  inventory_items: CreateInventoryItemDto[];
}
