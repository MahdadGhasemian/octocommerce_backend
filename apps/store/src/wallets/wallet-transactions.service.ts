import { Injectable } from '@nestjs/common';
import { IdentifierQuery, getPaginationConfig } from '@app/common';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { WALLET_TRANSACTION_PAGINATION_CONFIG } from './pagination-config';
import { WalletTransactionsRepository } from './wallet-transactions.repository';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { GetWalletTransactionDto } from './dto/get-wallet-transaction.dto';
import { User, WalletTransaction } from '@app/store';

@Injectable()
export class WalletTransactionsService {
  constructor(
    private readonly walletTransactionsRepository: WalletTransactionsRepository,
  ) {}

  async create(createWalletDto: CreateWalletTransactionDto, user: User) {
    const wallet = new WalletTransaction({
      ...createWalletDto,
      user_id: user.id,
    });

    const result = await this.walletTransactionsRepository.create(wallet);

    return this.findOne({ id: result.id }, { user_id: user.id });
  }

  async findAll(query: PaginateQuery, identifierQuery: IdentifierQuery) {
    return paginate(
      query,
      this.walletTransactionsRepository.entityRepository,
      getPaginationConfig(
        WALLET_TRANSACTION_PAGINATION_CONFIG,
        identifierQuery,
      ),
    );
  }

  async findOne(
    walletTransactionDto: Omit<GetWalletTransactionDto, 'user' | 'order'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.walletTransactionsRepository.findOne({
      ...walletTransactionDto,
      ...identifierQuery,
    });
  }
}
