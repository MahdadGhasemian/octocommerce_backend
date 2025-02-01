import { AbstractGetDto, GetUserDto, RecommendationType } from '@app/common';
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
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { GetReviewMediaDto } from './get-review-media.dto';
import { GetProductDto } from './get-product.dto';

export class GetReviewDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    example: 'Review 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  title?: string;

  @ApiProperty({
    example: 'The great product',
    required: true,
  })
  @IsString()
  @Expose()
  content?: string;

  @ApiProperty({
    example: 5,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  @Expose()
  rating?: number;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Expose()
  pros?: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  @Expose()
  cons?: string[];

  @ApiProperty({
    type: GetReviewMediaDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetReviewMediaDto)
  @Expose()
  images?: GetReviewMediaDto[];

  @ApiProperty({
    type: GetReviewMediaDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetReviewMediaDto)
  @Expose()
  videos?: GetReviewMediaDto[];

  @ApiProperty({
    enum: RecommendationType,
    default: RecommendationType.UNKNOWN,
    required: false,
  })
  @IsEnum(RecommendationType)
  @Expose()
  recommended?: RecommendationType;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  is_anonymous?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  user_has_bought_product?: boolean;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  user_id?: number;

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @Expose()
  product_id?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Expose()
  product_code?: string;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;

  @ApiProperty({
    type: GetProductDto,
    required: true,
  })
  @Type(() => GetProductDto)
  @Expose()
  product?: GetProductDto;
}
