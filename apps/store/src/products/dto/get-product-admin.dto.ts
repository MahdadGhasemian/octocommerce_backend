import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';

import { GetExternalSellerDto } from './get-external-seller.dto';
import { GetProductDto } from './get-product.dto';
import { GetPackagingCostDto } from './get-packaging-cost.dto';

export class GetProductAdminDto extends GetProductDto {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  @Expose()
  price_scale_value?: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @Expose()
  is_scalable_price?: boolean;

  @ApiProperty({
    type: GetExternalSellerDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetExternalSellerDto)
  @Expose()
  external_sellers: GetExternalSellerDto[];

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
