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
import { InstantsService } from '../instants/instants.service';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly instantsService: InstantsService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern(EVENT_NAME_USER_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async userCreated(@Payload() payload: UserCreatedEvent) {
    const { user } = payload;

    // create user
    await this.usersService.create(user);

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );

    if (user.created_by_system) {
      await this.instantsService.sendSMSUserCreatedBySystem(
        user?.mobile_phone,
        user?.mobile_phone,
        support_mobile_phone,
      );
    } else {
      await this.instantsService.sendSMSUserWelcome(
        user?.mobile_phone,
        support_mobile_phone,
      );
    }
  }

  @EventPattern(EVENT_NAME_USER_UPDATED)
  @UseInterceptors(MessageAckInterceptor)
  async userUpdated(@Payload() payload: UserUpdatedEvent) {
    const { user } = payload;

    await this.usersService.update(user.id, user);
  }
}
