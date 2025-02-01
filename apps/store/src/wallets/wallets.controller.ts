import {
  CurrentUser,
  Identifier,
  IdentifierQuery,
  JwtAuthAccessGuard,
  Serialize,
} from '@app/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { WalletTransactionsService } from './wallet-transactions.service';
import { GetMyWalletDto } from './dto/get-my-wallet.dto';
import { GetWalletTransactionDto } from './dto/get-wallet-transaction.dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  Paginate,
  PaginateQuery,
} from 'nestjs-paginate';
import { WALLET_TRANSACTION_PAGINATION_CONFIG } from './pagination-config';
import { ListWalletTransactionDto } from './dto/list-wallet-transaction.dto';
import { User } from '@app/store';

@ApiTags('Wallets')
@Controller('wallets')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly walletTransactionsService: WalletTransactionsService,
  ) {}

  @Get('transactions')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(ListWalletTransactionDto)
  @ApiOkPaginatedResponse(
    GetWalletTransactionDto,
    WALLET_TRANSACTION_PAGINATION_CONFIG,
  )
  @ApiPaginationQuery(WALLET_TRANSACTION_PAGINATION_CONFIG)
  async findAll(
    @Identifier() identifierQuery: IdentifierQuery,
    @Paginate() query: PaginateQuery,
  ) {
    return this.walletTransactionsService.findAll(query, identifierQuery);
  }

  @Get('my')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetMyWalletDto)
  @ApiOkResponse({
    type: GetMyWalletDto,
  })
  async findOne(@CurrentUser() user: User) {
    return this.walletsService.findOne({}, user);
  }
}
