import { Inject, Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { UpdateIsViewedMessageDto } from './dto/update-is-viewed-message.dto';
import { Message, User } from '@app/notification';
import {
  CreateBoardMessageDto,
  CreateMessageDto,
  UpdateBoardMessageDto,
} from './dto/create-message.dto';
import { GetMessageDto } from './dto/get-message.dto';
import {
  AUTH_SERVICE,
  EVENT_NAME_GET_USERS_WITH_NOTIFICATION_ACCESS,
  EVENT_NAME_MESSAGE_EVENT,
  MessageEvent,
  MessageGroupType,
  MessageType,
  NOTIFICATION_SERVICE,
  NotificationAccessRequestEvent,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messagesRepository: MessagesRepository,
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notficationClient: ClientProxy,
  ) {}

  async createOrderMessage(createMessageDto: CreateMessageDto) {
    const user = createMessageDto.user;
    const name = user?.first_name || user?.last_name;

    const users = await this.readNotificationOrderCreatedUsers();

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_ORDER,
        group_type: MessageGroupType.DEFAULT,
        title: 'سفارش جدید',
        body: name
          ? 'سفارش جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'سفارش جدیدی ثبت شد',
        data: createMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async createPaymentMessage(createMessageDto: CreateMessageDto) {
    const user = createMessageDto.user;
    const name = user?.first_name || user?.last_name;

    const users = await this.readNotificationPaymentCreatedUsers();

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_PAYMENT,
        group_type: MessageGroupType.DEFAULT,
        title: 'پرداخت جدید',
        body: name
          ? 'پرداخت جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'پرداخت جدیدی ثبت شد',
        data: createMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async createDeliveryMessage(createMessageDto: CreateMessageDto) {
    const user = createMessageDto.user;
    const name = user?.first_name || user?.last_name;

    const users = await this.readNotificationDeliveryCreatedUsers();

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_DELIVERY,
        group_type: MessageGroupType.DEFAULT,
        title: 'مشخصات حمل جدید',
        body: name
          ? 'مشخصات حمل جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'پرداخت جدیدی ثبت شد',
        data: createMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async createBoardMessage(createBoardMessageDto: CreateBoardMessageDto) {
    const { assigned_to, created_by } = createBoardMessageDto;

    const users = [];
    if (assigned_to) users.push(assigned_to);
    const name = created_by?.first_name || created_by?.last_name;

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_BOARD,
        group_type: MessageGroupType.BOARD,
        title: 'روند جدید',
        body: name
          ? 'روند جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'روند جدیدی ثبت شد',
        data: createBoardMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async updateBoardMessage(updateBoardMessageDto: UpdateBoardMessageDto) {
    const { assigned_to, created_by } = updateBoardMessageDto;

    const users = [];
    if (assigned_to) users.push(assigned_to);
    if (created_by) users.push(created_by);

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.EDIT_BOARD,
        group_type: MessageGroupType.BOARD,
        title: 'تغییر روند',
        body: 'تغییری در روند های مرتبط با شما ثبت شد.',
        data: updateBoardMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async createReviewMessage(createMessageDto: CreateMessageDto) {
    const user = createMessageDto.user;
    const name = user?.first_name || user?.last_name;

    const users = await this.readNotificationOrderCreatedUsers();

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_REVIEW,
        group_type: MessageGroupType.DEFAULT,
        title: 'نظر جدید',
        body: name
          ? 'نظر جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'نظر جدیدی ثبت شد',
        data: createMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async createQuestionMessage(createMessageDto: CreateMessageDto) {
    const user = createMessageDto.user;
    const name = user?.first_name || user?.last_name;

    const users = await this.readNotificationOrderCreatedUsers();

    const messages = users?.map((access_user) => {
      const message = new Message({
        type: MessageType.NEW_QUESTION,
        group_type: MessageGroupType.DEFAULT,
        title: 'سوال جدید',
        body: name
          ? 'سوال جدیدی توسط' + ' ' + `${name}` + ' ' + 'ثبت شد'
          : 'سوال جدیدی ثبت شد',
        data: createMessageDto,
        user: new User({ id: access_user.id }),
      });

      return this.messagesRepository.create(message);
    });

    const result = await Promise.all(messages);

    result.forEach((message) => {
      this.notficationClient.emit(
        EVENT_NAME_MESSAGE_EVENT,
        new MessageEvent(message.user, message),
      );
    });
  }

  async findOne(getMessageDto: GetMessageDto) {
    return this.messagesRepository.findOne(getMessageDto);
  }

  async findAllDefaultUnreadMessages(user: User) {
    return this.messagesRepository.findAndCount(
      {
        group_type: MessageGroupType.DEFAULT,
        user_id: user.id,
        is_viewed: false,
      },
      { created_at: 'DESC' },
      0,
      5,
    );
  }

  async findAllBoardUnreadMessages(user: User) {
    return this.messagesRepository.findAndCount(
      {
        group_type: MessageGroupType.BOARD,
        user_id: user.id,
        is_viewed: false,
      },
      { created_at: 'DESC' },
      0,
      5,
    );
  }

  async update(
    id: number,
    updateIsViewedMessageDto: UpdateIsViewedMessageDto,
    user: User,
  ) {
    return this.messagesRepository.findOneAndUpdate(
      { id, user_id: user.id },
      { ...updateIsViewedMessageDto },
    );
  }

  async updateAllDefaultGroup(
    updateIsViewedMessageDto: UpdateIsViewedMessageDto,
    user: User,
  ) {
    return this.messagesRepository.update(
      { user_id: user.id, group_type: MessageGroupType.DEFAULT },
      { ...updateIsViewedMessageDto },
    );
  }

  async updateAllBoardGroup(
    updateIsViewedMessageDto: UpdateIsViewedMessageDto,
    user: User,
  ) {
    return this.messagesRepository.update(
      { user_id: user.id, group_type: MessageGroupType.BOARD },
      { ...updateIsViewedMessageDto },
    );
  }

  private async readNotificationOrderCreatedUsers(): Promise<User[]> {
    return this.readNotificationAccess({ notification_order_created: true });
  }

  private async readNotificationPaymentCreatedUsers(): Promise<User[]> {
    return this.readNotificationAccess({ notification_payment_created: true });
  }

  private async readNotificationDeliveryCreatedUsers(): Promise<User[]> {
    return this.readNotificationAccess({ notification_delivery_created: true });
  }

  private async readNotificationAccess(query: object): Promise<User[]> {
    const key = JSON.stringify(query);
    let users: User[] | undefined = await this.cacheManager.get<User[]>(key);

    if (users) return users;

    const accessObservable = await this.authClient.send<User[]>(
      EVENT_NAME_GET_USERS_WITH_NOTIFICATION_ACCESS,
      new NotificationAccessRequestEvent(query),
    );
    users = await firstValueFrom(accessObservable);

    const ttl = this.configService.get('NOTIFICATION_ACCESS_READ_EXPIRATION');
    const cache_prefix = this.configService.getOrThrow<string>(
      'REDIS_CACHE_KEY_PREFIX_NOTIFICATION',
    );
    await this.cacheManager.set(`${cache_prefix}:${key}`, users, ttl);

    return users;
  }
}
