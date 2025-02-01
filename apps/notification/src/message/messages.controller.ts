import { Controller, UseInterceptors } from '@nestjs/common';

import { MessagesGateway } from './messages.gateway';
import { EventPattern, Payload } from '@nestjs/microservices';
import {
  EVENT_NAME_MESSAGE_EVENT,
  MessageAckInterceptor,
  MessageEvent,
} from '@app/common';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesGateway: MessagesGateway) {}

  @EventPattern(EVENT_NAME_MESSAGE_EVENT)
  @UseInterceptors(MessageAckInterceptor)
  async orderCreated(@Payload() payload: MessageEvent) {
    const { user, message } = payload;

    await this.messagesGateway.sendEvent(user, message);
  }
}
