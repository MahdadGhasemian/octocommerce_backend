import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  AbstractGetDto,
  GetUserDto,
  PaymentStatus,
  PaymentType,
} from '@app/common';
import { GetOrderDto } from '../../orders/dto/get-order.dto';

export class GetPaymentDto extends AbstractGetDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
    required: true,
  })
  @IsEnum(PaymentStatus)
  @Expose()
  payment_status?: PaymentStatus;

  @ApiProperty({
    enum: PaymentType,
    default: PaymentType.RECEIPT,
    required: true,
  })
  @IsEnum(PaymentType)
  @Expose()
  payment_type?: PaymentType;

  @ApiProperty({
    type: Number,
    example: 49,
    required: true,
  })
  @IsNumber()
  @Expose()
  amount?: number;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  attach_url?: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  rejected_note?: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  order_id?: number;

  @ApiProperty({
    type: GetOrderDto,
    required: true,
  })
  @Type(() => GetOrderDto)
  @Expose()
  order?: GetOrderDto;

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
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  redirect_url?: string;
}
