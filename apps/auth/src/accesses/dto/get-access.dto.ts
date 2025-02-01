import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { EndpointAccessDto } from './endpoint-access.dto';
import { Expose, Type } from 'class-transformer';

export class GetAccessDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: String,
    example: 'Manager',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  title?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  image?: string;

  @ApiProperty({
    type: String,
    example: '#FFFFFF',
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  @Expose()
  color?: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsBoolean()
  cannot_be_deleted?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: true,
  })
  @IsBoolean()
  @Expose()
  has_full_access?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: true,
  })
  @IsBoolean()
  @Expose()
  is_internal_user?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_order_created?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_payment_created?: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Expose()
  notification_delivery_created?: boolean;

  @ApiProperty({
    type: EndpointAccessDto,
    required: true,
    isArray: true,
  })
  @IsArray()
  @IsObject({ each: true })
  @IsNotEmpty({ each: true })
  @Type(() => EndpointAccessDto)
  @Expose()
  endpoints?: EndpointAccessDto[];

  @Expose()
  info_endpoints?: string[];
}
