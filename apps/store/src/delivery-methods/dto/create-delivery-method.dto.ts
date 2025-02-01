import {
  DeliveryChargeType,
  DeliveryPricingType,
  DeliveryType,
  UniqueAreaName,
} from '@app/common';
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
import { CreateDeliveryMethodAreaRuleDto } from './create-delivery-method-area-rule.dto';
import { Type } from 'class-transformer';

export class CreateDeliveryMethodDto {
  @ApiProperty({
    enum: DeliveryType,
    default: DeliveryType.POST_NORAMAL,
    required: true,
  })
  @IsEnum(DeliveryType)
  delivery_type: DeliveryType;

  @ApiProperty({
    enum: DeliveryChargeType,
    default: DeliveryChargeType.PREPAID,
    required: true,
  })
  @IsEnum(DeliveryChargeType)
  delivery_charge_type: DeliveryChargeType;

  @ApiProperty({
    enum: DeliveryPricingType,
    default: DeliveryPricingType.FIXED,
    required: true,
  })
  @IsEnum(DeliveryPricingType)
  delivery_pricing_type: DeliveryPricingType;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  fixed_price: number;

  @ApiProperty({
    type: Number,
    required: false,
    example: 10000,
  })
  @IsNumber()
  @IsOptional()
  per_kilometer: number;

  @ApiProperty({
    type: CreateDeliveryMethodAreaRuleDto,
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryMethodAreaRuleDto)
  @IsOptional()
  @UniqueAreaName({
    message: 'The area_name field must be unique across all rules.',
  })
  delivery_method_area_rules: CreateDeliveryMethodAreaRuleDto[];

  @ApiProperty({
    type: Boolean,
    default: true,
  })
  @IsBoolean()
  is_enabled: boolean;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}
