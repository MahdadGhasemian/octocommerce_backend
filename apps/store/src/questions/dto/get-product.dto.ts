import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCategoryDto } from './get-category.dto';
import { MaterialUnit } from '@app/common';

export class GetProductDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'V1000',
    required: true,
  })
  @IsString()
  @Expose()
  product_code?: string;

  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
  @Expose()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  image?: string;

  @ApiProperty({
    type: String,
    example: ['http://www.localhost/image1000.jpg'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  @Expose()
  images?: string[];

  @ApiProperty({
    required: true,
    example: 10000,
  })
  @IsNumber()
  @Expose()
  sale_price?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  discount_percentage: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  discount_amount: number;

  @ApiProperty({
    enum: MaterialUnit,
    default: MaterialUnit.DEVICE,
    required: true,
  })
  @IsEnum(MaterialUnit)
  @Expose()
  unit?: MaterialUnit;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @Expose()
  is_active?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @Expose()
  is_online_payment_allowed?: boolean;

  @IsNumber()
  @IsOptional()
  @Expose()
  category_id?: number;

  @IsObject()
  @IsOptional()
  @Type(() => GetCategoryDto)
  @Expose()
  category?: GetCategoryDto;
}
