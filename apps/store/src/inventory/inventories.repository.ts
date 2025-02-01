import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Inventory } from '@app/store';
@Injectable()
export class InventoriesRepository extends AbstractRepository<Inventory> {
  protected readonly logger = new Logger(InventoriesRepository.name);

  constructor(
    @InjectRepository(Inventory) inventoriesRepository: Repository<Inventory>,
    entityManager: EntityManager,
  ) {
    super(inventoriesRepository, entityManager);
  }
}
