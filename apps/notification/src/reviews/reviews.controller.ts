import { Controller, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_REVIEW_CREATED,
  MessageAckInterceptor,
  ReviewCreatedEvent,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagesService } from '../message/messages.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly messagesService: MessagesService) {}

  @EventPattern(EVENT_NAME_REVIEW_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async reviewCreated(@Payload() payload: ReviewCreatedEvent) {
    const { review } = payload;

    await this.messagesService.createReviewMessage(review);
  }
}
