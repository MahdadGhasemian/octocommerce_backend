import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetUserDto, PaymentStatus, PaymentType } from '@app/common';

export class GetPaymentDto {
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
    example: 49,
    required: true,
  })
  @IsNumber()
  @Expose()
  amount?: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @Expose()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @Expose()
  attach_url?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @Expose()
  rejected_note?: string;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsDateString()
  @Expose()
  paid_date?: Date;

  @ApiProperty({
    type: GetUserDto,
  })
  @IsObject()
  @Type(() => GetUserDto)
  @Expose()
  confirmed_rejected_by?: GetUserDto;
}
