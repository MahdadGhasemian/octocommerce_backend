import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DeliveryMethod } from '@app/store';
@Injectable()
export class DeliveryMethodsRepository extends AbstractRepository<DeliveryMethod> {
  protected readonly logger = new Logger(DeliveryMethodsRepository.name);

  constructor(
    @InjectRepository(DeliveryMethod)
    deliveryMethodsRepository: Repository<DeliveryMethod>,
    entityManager: EntityManager,
  ) {
    super(deliveryMethodsRepository, entityManager);
  }
}
