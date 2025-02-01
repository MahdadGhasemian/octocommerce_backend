import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDeliveryDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  delivery_method_id: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  delivery_method_area_rule_area_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  delivery_address: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  delivery_city: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  delivery_postal_code: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  delivery_note: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  driver_name: string;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  delivery_latitude?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  delivery_longitude?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  driver_phone_number: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  car_license_plate: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  recipient_name: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  recipient_national_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  recipient_phone_number: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  recipient_mobile_phone_number: string;
}
