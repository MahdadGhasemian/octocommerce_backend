import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

import { GetCategoryDto } from './get-category.dto';
import { GetExternalCategorySellerDto } from './get-external-category-seller.dto';

export class GetCategoryAdminDto extends GetCategoryDto {
  @ApiProperty({
    type: GetExternalCategorySellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetExternalCategorySellerDto)
  @Expose()
  external_category_sellers: GetExternalCategorySellerDto[];
}
