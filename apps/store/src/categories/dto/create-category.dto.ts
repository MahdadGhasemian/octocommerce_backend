import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateExternalCategorySellerDto } from './create-external-category-seller.dto';
import { Type } from 'class-transformer';
import { AtLeastOne } from '@app/common';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Category 1',
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
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  @ApiProperty({
    example: 'Category 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  parent_name?: string;

  @ApiProperty({
    example: 'Category 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  parent_external_category_sellers_name?: string;

  @ApiProperty({
    type: CreateExternalCategorySellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateExternalCategorySellerDto)
  @IsOptional()
  external_category_sellers: CreateExternalCategorySellerDto[];

  @AtLeastOne({
    message:
      'At least one of parent_id, parent_name, or parent_external_category_sellers_name is required.',
  })
  validateAtLeastOne?: any;
}
