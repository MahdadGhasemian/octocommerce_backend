import { Controller, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_QUESTION_CREATED,
  MessageAckInterceptor,
  QuestionCreatedEvent,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagesService } from '../message/messages.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly messagesService: MessagesService) {}

  @EventPattern(EVENT_NAME_QUESTION_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async questionCreated(@Payload() payload: QuestionCreatedEvent) {
    const { question } = payload;

    await this.messagesService.createQuestionMessage(question);
  }
}
