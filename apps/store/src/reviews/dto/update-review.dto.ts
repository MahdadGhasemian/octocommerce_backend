import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
import { CreateReviewMediaDto } from './create-review-media.dto';
import { RecommendationType } from '@app/common';

export class UpdateReviewDto {
  @ApiProperty({
    example: 'Review 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'The great product',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 5,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating: number;

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  pros: string[];

  @ApiProperty({
    type: String,
    isArray: true,
    required: false,
  })
  @IsArray()
  @IsOptional()
  cons: string[];

  @ApiProperty({
    type: CreateReviewMediaDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateReviewMediaDto)
  images: CreateReviewMediaDto[];

  @ApiProperty({
    type: CreateReviewMediaDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateReviewMediaDto)
  videos: CreateReviewMediaDto[];

  @ApiProperty({
    enum: RecommendationType,
    default: RecommendationType.UNKNOWN,
    required: false,
  })
  @IsEnum(RecommendationType)
  recommended: RecommendationType;

  @ApiProperty({
    type: Boolean,
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_anonymous: boolean;
}
