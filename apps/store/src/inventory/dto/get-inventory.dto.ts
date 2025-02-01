import { GetUserDto, InventoryType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
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
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetInventoryItemDto)
  @Expose()
  inventory_items?: GetInventoryItemDto[];

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @Expose()
  created_by_user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  created_by?: GetUserDto;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @Expose()
  updated_by_user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  updated_by?: GetUserDto;
}
