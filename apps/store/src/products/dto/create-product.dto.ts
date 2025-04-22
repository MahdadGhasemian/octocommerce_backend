import { ProductType, MaterialUnit } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSpecificationDto } from './create-specification.dto';
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
import { CreateExternalSellerDto } from './create-external-seller.dto';

export class CreateProductDto {
  @ApiProperty({
    example: 'Product 1',
    required: true,
  })
  @IsString()
  name: string;

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
    required: true,
    example: 10000,
  })
  @IsNumber()
  sale_price?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  discount_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
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
    required: true,
  })
  @IsEnum(MaterialUnit)
  unit: MaterialUnit;

  @ApiProperty({
    required: false,
    example: true,
  })
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  is_online_payment_allowed?: boolean;

  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    type: CreateSpecificationDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateSpecificationDto)
  @IsOptional()
  specifications: CreateSpecificationDto[];

  @ApiProperty({
    type: CreateExternalSellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateExternalSellerDto)
  @IsOptional()
  external_sellers: CreateExternalSellerDto[];
}
