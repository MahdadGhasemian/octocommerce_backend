import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WalletTransaction } from '@app/store';
@Injectable()
export class WalletTransactionsRepository extends AbstractRepository<WalletTransaction> {
  protected readonly logger = new Logger(WalletTransactionsRepository.name);

  constructor(
    @InjectRepository(WalletTransaction)
    walletTransactionsRepository: Repository<WalletTransaction>,
    entityManager: EntityManager,
  ) {
    super(walletTransactionsRepository, entityManager);
  }
}
