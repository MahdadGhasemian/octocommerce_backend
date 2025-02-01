import { Controller, UseInterceptors } from '@nestjs/common';
import {
  MessageAckInterceptor,
  EVENT_NAME_BOARD_UPDATED,
  BoardCreatedEvent,
  EVENT_NAME_BOARD_CREATED,
  BoardUpdatedEvent,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagesService } from '../message/messages.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly messagesService: MessagesService) {}

  @EventPattern(EVENT_NAME_BOARD_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async boardCreated(@Payload() payload: BoardCreatedEvent) {
    const { board } = payload;

    await this.messagesService.createBoardMessage(board);
  }

  @EventPattern(EVENT_NAME_BOARD_UPDATED)
  @UseInterceptors(MessageAckInterceptor)
  async boardUpdated(@Payload() payload: BoardUpdatedEvent) {
    const { board } = payload;

    await this.messagesService.updateBoardMessage(board);
  }
}
