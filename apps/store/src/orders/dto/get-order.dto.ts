import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AbstractGetDto, GetUserDto, OrderStatus } from '@app/common';
import { GetOrderItemDto } from './get-order-item.dto';
import { GetContactDto } from './get-contact.dto';
import { GetDeliveryDto } from './get-delivery.dto';
import { GetPaymentDto } from './get-payment.dto';

export class GetOrderDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
    required: true,
  })
  @IsEnum(OrderStatus)
  @Expose()
  order_status?: OrderStatus;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  order_invoice_number?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  order_bank_identifier_code?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  subtotal?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  packaging_cost?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  delivery_cost?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  discount_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  discount_amount?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  tax_on_profit_percentage_default?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  tax_rate_percentage?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  tax_amount?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  round_amount?: number;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  total?: number;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  note?: string;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  @Expose()
  is_paid?: boolean;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  rejected_note?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  share_code?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  pdf_file_name?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Expose()
  pdf_file_url?: string;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  delivery_date?: Date;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @IsOptional()
  @Expose()
  due_date?: Date;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;

  @ApiProperty({
    type: GetOrderItemDto,
    required: true,
    isArray: true,
  })
  @Type(() => GetOrderItemDto)
  @IsArray()
  @Expose()
  order_items?: GetOrderItemDto[];

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  contact_id?: number;

  @ApiProperty({
    type: GetContactDto,
    required: true,
  })
  @Type(() => GetContactDto)
  @Expose()
  contact?: GetContactDto;

  @ApiProperty({
    type: GetContactDto,
    required: true,
  })
  @Type(() => GetContactDto)
  @Expose()
  contact_snapshot?: GetContactDto;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  billing_contact_id?: number;

  @ApiProperty({
    type: GetContactDto,
    required: true,
  })
  @Type(() => GetContactDto)
  @Expose()
  billing_contact?: GetContactDto;

  @ApiProperty({
    type: GetContactDto,
    required: true,
  })
  @Type(() => GetContactDto)
  @Expose()
  billing_contact_snapshot?: GetContactDto;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  @Expose()
  is_confirmed_rejected_by_system?: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  confirmed_rejected_by_user_id?: number;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  confirmed_rejected_by?: GetUserDto;

  @ApiProperty({
    type: GetDeliveryDto,
    required: true,
  })
  @Type(() => GetDeliveryDto)
  @Expose()
  delivery?: GetDeliveryDto;

  @ApiProperty({
    type: GetPaymentDto,
    required: true,
    isArray: true,
  })
  @Type(() => GetPaymentDto)
  @Expose()
  payments?: GetPaymentDto[];
}
