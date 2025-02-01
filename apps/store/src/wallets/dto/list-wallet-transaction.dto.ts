import { ListDto } from '@app/common';
import { Expose, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { GetWalletTransactionDto } from './get-wallet-transaction.dto';

export class ListWalletTransactionDto extends ListDto<GetWalletTransactionDto> {
  @IsArray()
  @Type(() => GetWalletTransactionDto)
  @Expose()
  data: GetWalletTransactionDto[];
}
