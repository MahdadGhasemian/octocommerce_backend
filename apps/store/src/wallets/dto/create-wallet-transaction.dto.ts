import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TransactionNote, TransactionType } from '@app/common';

export class CreateWalletTransactionDto {
  @ApiProperty({
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsOptional()
  amount: number;

  @ApiProperty({
    enum: TransactionType,
    required: true,
  })
  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @ApiProperty({
    enum: TransactionNote,
    required: true,
  })
  @IsEnum(TransactionNote)
  transaction_note: TransactionNote;
}
