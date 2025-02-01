import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { InventoryItem } from '@app/store';

@Injectable()
export class InventoryItemsRepository extends AbstractRepository<InventoryItem> {
  protected readonly logger = new Logger(InventoryItemsRepository.name);

  constructor(
    @InjectRepository(InventoryItem)
    inventoryItemsRepository: Repository<InventoryItem>,
    entityManager: EntityManager,
  ) {
    super(inventoryItemsRepository, entityManager);
  }
}
