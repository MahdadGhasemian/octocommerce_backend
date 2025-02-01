import {
  DeliveryChargeType,
  DeliveryPricingType,
  DeliveryType,
} from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetDeliveryMethodDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    enum: DeliveryType,
    default: DeliveryType.POST_NORAMAL,
    required: true,
  })
  @IsEnum(DeliveryType)
  @Expose()
  delivery_type?: DeliveryType;

  @ApiProperty({
    enum: DeliveryChargeType,
    default: DeliveryChargeType.PREPAID,
    required: true,
  })
  @IsEnum(DeliveryChargeType)
  @Expose()
  delivery_charge_type?: DeliveryChargeType;

  @ApiProperty({
    enum: DeliveryPricingType,
    default: DeliveryPricingType.FIXED,
    required: true,
  })
  @IsEnum(DeliveryPricingType)
  @Expose()
  delivery_pricing_type?: DeliveryPricingType;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  fixed_price?: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  per_kilometer?: number;

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  @Expose()
  is_enabled?: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;
}
