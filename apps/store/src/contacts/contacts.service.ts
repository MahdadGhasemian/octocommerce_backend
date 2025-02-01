import { Injectable } from '@nestjs/common';
import { ContactsRepository } from './contacts.repository';
import { CreateContactDto } from './dto/create-contact.dto';
import { IdentifierQuery, getPaginationConfig } from '@app/common';
import { GetContactDto } from './dto/get-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { CONTACT_PAGINATION_CONFIG } from './pagination-config';
import { Contact, User } from '@app/store';
import { CreateContactForOtherUserDto } from './dto/create-contact-for-other-user.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepository: ContactsRepository) {}

  async create(createContactDto: CreateContactDto, user: User) {
    const contact = new Contact({
      ...createContactDto,
      user_id: user.id,
    });

    const result = await this.contactsRepository.create(contact);

    return this.findOne({ id: result.id }, { user_id: user.id });
  }

  async createForOtherUser(
    createContactForOtherUserDto: CreateContactForOtherUserDto,
  ) {
    const contact = new Contact({
      ...createContactForOtherUserDto,
    });

    const result = await this.contactsRepository.create(contact);

    return this.findOne(
      { id: result.id },
      { user_id: createContactForOtherUserDto.user_id },
    );
  }

  async findAll(query: PaginateQuery, identifierQuery: IdentifierQuery) {
    return paginate(
      query,
      this.contactsRepository.entityRepository,
      getPaginationConfig(CONTACT_PAGINATION_CONFIG, identifierQuery),
    );
  }

  async findOne(contactDto: GetContactDto, identifierQuery: IdentifierQuery) {
    return this.contactsRepository.findOne({
      ...contactDto,
      ...identifierQuery,
    });
  }

  async findOneNoCheck(
    contactDto: GetContactDto,
    identifierQuery: IdentifierQuery,
  ) {
    return this.contactsRepository.findOneNoCheck({
      ...contactDto,
      ...identifierQuery,
    });
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
    identifierQuery: IdentifierQuery,
  ) {
    const updateData: Partial<Contact> = {
      ...updateContactDto,
    };

    const result = await this.contactsRepository.findOneAndUpdate(
      { id, ...identifierQuery },
      { ...updateData },
    );

    return this.findOne({ id: result.id }, identifierQuery);
  }

  async remove(id: number, identifierQuery: IdentifierQuery) {
    return this.contactsRepository.findOneAndDelete({ id, ...identifierQuery });
  }
}
