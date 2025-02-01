import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Telegram } from '@app/bot';
@Injectable()
export class TelegramsRepository extends AbstractRepository<Telegram> {
  protected readonly logger = new Logger(TelegramsRepository.name);

  constructor(
    @InjectRepository(Telegram) telegramsRepository: Repository<Telegram>,
    entityManager: EntityManager,
  ) {
    super(telegramsRepository, entityManager);
  }
}
