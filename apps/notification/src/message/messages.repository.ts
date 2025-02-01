import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Message } from '@app/notification';

@Injectable()
export class MessagesRepository extends AbstractRepository<Message> {
  protected readonly logger = new Logger(MessagesRepository.name);

  constructor(
    @InjectRepository(Message) messagesRepository: Repository<Message>,
    entityManager: EntityManager,
  ) {
    super(messagesRepository, entityManager);
  }
}
