import { GetUserDto, TransactionNote, TransactionType } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { GetOrderDto } from '../../orders/dto/get-order.dto';

export class GetWalletTransactionDto {
  @ApiProperty({
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  id?: number;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  amount?: number;

  @ApiProperty({
    enum: TransactionType,
    required: true,
  })
  @IsEnum(TransactionType)
  @Expose()
  transaction_type?: TransactionType;

  @ApiProperty({
    enum: TransactionNote,
    required: true,
  })
  @IsEnum(TransactionNote)
  @Expose()
  transaction_note?: TransactionNote;

  @ApiProperty({
    type: GetUserDto,
    required: true,
  })
  @Type(() => GetUserDto)
  @Expose()
  user?: GetUserDto;

  @ApiProperty({
    type: GetOrderDto,
    required: true,
  })
  @Type(() => GetOrderDto)
  @Expose()
  order?: GetOrderDto;
}
