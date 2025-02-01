import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PackagingCost } from '@app/store';
@Injectable()
export class PackagingCostsRepository extends AbstractRepository<PackagingCost> {
  protected readonly logger = new Logger(PackagingCostsRepository.name);

  constructor(
    @InjectRepository(PackagingCost)
    packagingCostsRepository: Repository<PackagingCost>,
    entityManager: EntityManager,
  ) {
    super(packagingCostsRepository, entityManager);
  }
}
