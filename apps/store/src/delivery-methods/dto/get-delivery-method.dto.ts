import {
  DeliveryChargeType,
  DeliveryPricingType,
  DeliveryType,
} from '@app/common';
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
import { GetDeliveryMethodAreaRuleDto } from './get-delivery-method-area-rule.dto';

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
    type: GetDeliveryMethodAreaRuleDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => GetDeliveryMethodAreaRuleDto)
  @IsOptional()
  @Expose()
  delivery_method_area_rules?: GetDeliveryMethodAreaRuleDto[];

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
