import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ShortMessage } from '@app/store';

@Injectable()
export class ShortMessagesRepository extends AbstractRepository<ShortMessage> {
  protected readonly logger = new Logger(ShortMessagesRepository.name);

  constructor(
    @InjectRepository(ShortMessage)
    shortMessagesRepository: Repository<ShortMessage>,
    entityManager: EntityManager,
  ) {
    super(shortMessagesRepository, entityManager);
  }
}
