import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Warehouse } from '@app/store';
@Injectable()
export class WarehousesRepository extends AbstractRepository<Warehouse> {
  protected readonly logger = new Logger(WarehousesRepository.name);

  constructor(
    @InjectRepository(Warehouse) warehousesRepository: Repository<Warehouse>,
    entityManager: EntityManager,
  ) {
    super(warehousesRepository, entityManager);
  }
}
