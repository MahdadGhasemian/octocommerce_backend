import { PaymentType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    type: Date,
    required: true,
  })
  @IsNumber()
  order_id: number;

  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: PaymentType,
    default: PaymentType.RECEIPT,
    required: true,
  })
  @IsEnum(PaymentType)
  payment_type?: PaymentType;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  attach_url?: string;
}
