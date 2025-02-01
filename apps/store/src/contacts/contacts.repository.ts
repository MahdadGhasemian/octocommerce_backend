import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Contact } from '@app/store';
@Injectable()
export class ContactsRepository extends AbstractRepository<Contact> {
  protected readonly logger = new Logger(ContactsRepository.name);

  constructor(
    @InjectRepository(Contact) contactsRepository: Repository<Contact>,
    entityManager: EntityManager,
  ) {
    super(contactsRepository, entityManager);
  }
}
