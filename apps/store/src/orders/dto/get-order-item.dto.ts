import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { GetProductDto } from './get-product.dto';
import { GetInventoryItemDto } from './get-inventory-item.dto';

export class GetOrderItemDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id: number;

  @ApiProperty({
    type: GetProductDto,
    required: true,
  })
  @Type(() => GetProductDto)
  @Expose()
  product: GetProductDto;

  @ApiProperty({
    type: GetInventoryItemDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @Type(() => GetInventoryItemDto)
  @Expose()
  inventory_items?: GetInventoryItemDto[];

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  sale_price: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  discount_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  discount_amount?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  quantity: number;

  @ApiProperty({})
  @Expose()
  bonus_data: any;
}
