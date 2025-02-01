import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @IsNumber()
  delivery_method_id: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  delivery_method_area_rule_area_name: string;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @IsNumber()
  contact_id: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  billing_contact_id: number;

  @ApiProperty({
    type: CreateOrderItemDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];

  @ApiProperty({
    type: Number,
    required: false,
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  discount_percentage: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  note?: string;
}
