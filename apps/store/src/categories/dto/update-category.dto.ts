import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { UpdateExternalCategorySellerDto } from './update-external-category-seller.dto';
import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    type: UpdateExternalCategorySellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => UpdateExternalCategorySellerDto)
  @IsOptional()
  external_category_sellers: UpdateExternalCategorySellerDto[];
}
