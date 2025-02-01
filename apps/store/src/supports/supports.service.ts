import { Inject, Injectable } from '@nestjs/common';
import { SendShortMessageDto } from './dto/send-short-message.dto';
import {
  EVENT_NAME_SEND_SEND_SMS_GENERAL,
  IdentifierQuery,
  NOTIFICATION_SERVICE,
  SendShortMessageGeneralEvent,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { ShortMessagesRepository } from './short-messages.repository';
import { ShortMessage, User } from '@app/store';
import { GetShortMessageDto } from './dto/get-short-message.dto';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { SHORT_MESSAGE_PAGINATION_CONFIG } from './pagination-config';
import { CreateShortMessageDto } from './dto/create-short-message.dto';

@Injectable()
export class SupportsService {
  constructor(
    private readonly shortMessagesRepository: ShortMessagesRepository,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) {}

  async sendShortMessage(sendShortMessageDto: SendShortMessageDto, user: User) {
    const { mobile_phone, title_type, text_list } = sendShortMessageDto;

    // Send SMS
    this.notficationClient.emit(
      EVENT_NAME_SEND_SEND_SMS_GENERAL,
      new SendShortMessageGeneralEvent(mobile_phone, title_type, text_list),
    );

    const shortMessage = new ShortMessage({
      mobile_phone,
      title_type,
      text_list,
      is_sent_by_system: false,
      user_id: user.id,
    });

    const result = await this.shortMessagesRepository.create(shortMessage);

    return this.findOne({ id: result.id }, { user_id: user.id });
  }

  async createShortMessage(createShortMessageDto: CreateShortMessageDto) {
    const { mobile_phone, title_type, text_list } = createShortMessageDto;

    const shortMessage = new ShortMessage({
      mobile_phone,
      title_type,
      text_list,
      is_sent_by_system: true,
    });

    await this.shortMessagesRepository.create(shortMessage);

    return;
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.shortMessagesRepository.entityRepository,
      SHORT_MESSAGE_PAGINATION_CONFIG,
    );
  }

  async findOne(
    getShortMessageDto: Omit<GetShortMessageDto, 'text_list'>,
    identifierQuery: IdentifierQuery,
  ) {
    return this.shortMessagesRepository.findOne(
      {
        ...getShortMessageDto,
        ...identifierQuery,
      },
      {
        user: true,
      },
    );
  }
}
