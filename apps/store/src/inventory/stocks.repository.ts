import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Stock } from '@app/store';

@Injectable()
export class StocksRepository extends AbstractRepository<Stock> {
  protected readonly logger = new Logger(StocksRepository.name);

  constructor(
    @InjectRepository(Stock)
    stocksRepository: Repository<Stock>,
    entityManager: EntityManager,
  ) {
    super(stocksRepository, entityManager);
  }
}
