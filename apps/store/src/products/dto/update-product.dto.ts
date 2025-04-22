import { ProductType, MaterialUnit } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
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
import { Type } from 'class-transformer';
import { UpdateSpecificationDto } from 'apps/store/src/products/dto/update-specification.dto';
import { UpdateExternalSellerDto } from './update-external-seller.dto';

export class UpdateProductDto {
  @ApiProperty({
    example: 'Product 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'http://www.localhost/image1000.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
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
  images?: string[];

  @ApiProperty({
    example: 'http://www.localhost/image1000.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  datasheet?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  part_number?: string;

  @ApiProperty({
    enum: ProductType,
    default: ProductType.UNKNOWN,
    required: false,
  })
  @IsEnum(ProductType)
  @IsOptional()
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
  keywords?: string[];

  @ApiProperty({
    required: false,
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  available_quantity?: number;

  @ApiProperty({
    required: false,
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  sale_price?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  discount_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  discount_amount?: number;

  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsNumber()
  price_scale_value: number;

  @ApiProperty({
    required: true,
    example: true,
  })
  @IsBoolean()
  is_scalable_price: boolean;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  packaging_cost_id?: number;

  @ApiProperty({
    enum: MaterialUnit,
    default: MaterialUnit.DEVICE,
    required: false,
  })
  @IsEnum(MaterialUnit)
  @IsOptional()
  unit?: MaterialUnit;

  @ApiProperty({
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  is_online_payment_allowed?: boolean;

  @ApiProperty({
    required: false,
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    type: UpdateSpecificationDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateSpecificationDto)
  @IsOptional()
  specifications: UpdateSpecificationDto[];

  @ApiProperty({
    type: UpdateExternalSellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateExternalSellerDto)
  @IsOptional()
  external_sellers: UpdateExternalSellerDto[];
}
