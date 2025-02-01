import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Bonus } from '@app/store';

@Injectable()
export class BonusesRepository extends AbstractRepository<Bonus> {
  protected readonly logger = new Logger(BonusesRepository.name);

  constructor(
    @InjectRepository(Bonus) bonusesRepository: Repository<Bonus>,
    entityManager: EntityManager,
  ) {
    super(bonusesRepository, entityManager);
  }
}
