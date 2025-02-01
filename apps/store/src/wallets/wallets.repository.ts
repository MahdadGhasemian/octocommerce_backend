import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Wallet } from '@app/store';
@Injectable()
export class WalletsRepository extends AbstractRepository<Wallet> {
  protected readonly logger = new Logger(WalletsRepository.name);

  constructor(
    @InjectRepository(Wallet) walletsRepository: Repository<Wallet>,
    entityManager: EntityManager,
  ) {
    super(walletsRepository, entityManager);
  }
}
