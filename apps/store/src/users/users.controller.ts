import { Controller, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_NAME_USER_CREATED,
  EVENT_NAME_USER_UPDATED,
  MessageAckInterceptor,
  UserCreatedEvent,
  UserUpdatedEvent,
} from '@app/common';
import { User } from '@app/store';
import { ContactsService } from '../contacts/contacts.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly contactsService: ContactsService,
  ) {}

  @EventPattern(EVENT_NAME_USER_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async userCreated(@Payload() payload: UserCreatedEvent) {
    const { user } = payload;

    // create user
    await this.usersService.create(user);

    // create contact
    const contact = {
      title: 'پیش فرض',
      name: `${user?.first_name || ''} ${user?.last_name || ''}`,
      mobile_phone: user?.mobile_phone?.replace('+98', '0'),
    };
    await this.contactsService.create(contact, { id: user.id } as User);
  }

  @EventPattern(EVENT_NAME_USER_UPDATED)
  @UseInterceptors(MessageAckInterceptor)
  async userUpdated(@Payload() payload: UserUpdatedEvent) {
    await this.usersService.update(payload.user.id, payload.user);
  }
}
