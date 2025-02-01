import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeliveryStatus, DeliveryType, GetUserDto } from '@app/common';
import { GetDeliveryMethodDto } from './get-delivery-method.dto';

export class GetDeliveryDto {
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
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  delivery_address: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  delivery_city: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  delivery_postal_code: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  delivery_note: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  delivery_latitude?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  delivery_longitude?: number;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  driver_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  driver_phone_number: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  car_license_plate: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  recipient_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  recipient_national_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  recipient_phone_number: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Expose()
  recipient_mobile_phone_number: string;

  @ApiProperty({
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
    required: true,
  })
  @IsEnum(DeliveryStatus)
  @Expose()
  delivery_status?: DeliveryStatus;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  confirmation_date?: Date;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  rejected_note?: string;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  confirmed_rejected_by?: GetUserDto;

  @ApiProperty({
    type: GetDeliveryMethodDto,
    required: true,
  })
  @Type(() => GetDeliveryMethodDto)
  @Expose()
  delivery_method?: GetDeliveryMethodDto;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @Expose()
  delivery_method_area_rule_area_name: string;
}
