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
  ValidateNested,
} from 'class-validator';
import { GetCategoryDto } from '../../categories/dto/get-category.dto';
import { ProductType, MaterialUnit, AbstractGetDto } from '@app/common';
import { GetReviewDto } from './get-review.dto';
import { GetSpecificationDto } from './get-specification.dto';
import { GetPackagingCostDto } from './get-packaging-cost.dto';

export class GetProductDto extends AbstractGetDto {
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
    example: 'http://www.localhost/image1000.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  datasheet?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  part_number?: string;

  @ApiProperty({
    enum: ProductType,
    default: ProductType.UNKNOWN,
    required: false,
  })
  @IsEnum(ProductType)
  @IsOptional()
  @Expose()
  product_type?: ProductType;

  @ApiProperty({
    type: String,
    example: ['product'],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty({ each: true })
  @IsOptional()
  @Expose()
  keywords?: string[];

  @ApiProperty({
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  available_quantity?: number;

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
  discount_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Expose()
  discount_amount?: number;

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

  @ApiProperty({
    type: GetCategoryDto,
    required: true,
  })
  @IsObject()
  @IsOptional()
  @Type(() => GetCategoryDto)
  @Expose()
  category?: GetCategoryDto;

  @ApiProperty({
    type: GetReviewDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetReviewDto)
  @Expose()
  reviews: GetReviewDto[];

  @ApiProperty({
    type: GetSpecificationDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetSpecificationDto)
  @Expose()
  specifications: GetSpecificationDto[];

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @Expose()
  packaging_cost_id?: number;

  @ApiProperty({
    type: GetPackagingCostDto,
    required: true,
  })
  @IsObject()
  @Type(() => GetPackagingCostDto)
  @Expose()
  packaging_cost?: GetPackagingCostDto;
}
