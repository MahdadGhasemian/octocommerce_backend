import { AUTH_SERVICE, CurrentUser, JwtAuthAccessGuard } from '@app/common';
import { User } from '@app/notification';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ClientProxy } from '@nestjs/microservices';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom, isObservable } from 'rxjs';
import { Server } from 'socket.io';
import { MessagesService } from './messages.service';
import { UpdateIsViewedMessageDto } from './dto/update-is-viewed-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  },
})
@UseGuards(JwtAuthAccessGuard)
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  protected readonly logger = new Logger(MessagesGateway.name);

  @WebSocketServer()
  server: Server;

  async sendEvent(to: User, sendMessageDto: SendMessageDto) {
    this.server.to(String(to.id)).emit(
      'events',
      JSON.stringify({
        key: 'new_message',
        value: sendMessageDto,
      }),
    );
  }

  async sendInitialMessage(user: User) {
    //
    const [default_messages, default_count] =
      await this.messagesService.findAllDefaultUnreadMessages(user);
    const [board_messages, board_count] =
      await this.messagesService.findAllBoardUnreadMessages(user);

    //
    this.server.to(String(user.id)).emit(
      'events',
      JSON.stringify({
        key: 'initial_message',
        value: {
          default_total: default_count,
          board_total: board_count,
          last_messages: default_messages.concat(board_messages),
        },
      }),
    );
  }

  @SubscribeMessage('message_viewed')
  async messageViewed(
    @CurrentUser() user: User,
    @MessageBody() updateMessageDto: UpdateMessageDto,
  ) {
    await this.messagesService.update(
      +updateMessageDto.id,
      updateMessageDto as UpdateIsViewedMessageDto,
      user,
    );

    this.sendInitialMessage(user);
  }

  @SubscribeMessage('all_default_group_messages_viewed')
  async messagesDefaultViewed(
    @CurrentUser() user: User,
    @MessageBody() updateIsViewedMessageDto: UpdateIsViewedMessageDto,
  ) {
    await this.messagesService.updateAllDefaultGroup(
      {
        is_viewed: updateIsViewedMessageDto.is_viewed,
      } as UpdateIsViewedMessageDto,
      user,
    );

    this.sendInitialMessage(user);
  }

  @SubscribeMessage('all_board_group_messages_viewed')
  async messagesBoardViewed(
    @CurrentUser() user: User,
    @MessageBody() updateIsViewedMessageDto: UpdateIsViewedMessageDto,
  ) {
    await this.messagesService.updateAllBoardGroup(
      {
        is_viewed: updateIsViewedMessageDto.is_viewed,
      } as UpdateIsViewedMessageDto,
      user,
    );

    this.sendInitialMessage(user);
  }

  async handleConnection(client: any) {
    const { sockets } = this.server.sockets;

    const context = new ExecutionContextHost([client]);
    context.setType('ws');
    const guard = new JwtAuthAccessGuard(this.authClient);
    try {
      let canActivate = guard.canActivate(context);

      if (typeof canActivate === 'boolean') {
        canActivate = Promise.resolve(canActivate);
      } else if (canActivate instanceof Promise) {
        canActivate = canActivate;
      } else if (isObservable(canActivate)) {
        canActivate = firstValueFrom(canActivate);
      } else {
        this.logger.debug(
          `Invalid return type from canActivate : ${client?.id}`,
        );
        throw new Error('Invalid return type from canActivate');
      }

      const canActivateResult = await canActivate;

      if (canActivateResult) {
        const user = client.user;
        if (user && user.id) {
          client.join(String(user.id));

          this.sendInitialMessage(user);
        }
        this.logger.debug(`Client id: ${client.id} connected`);
        this.logger.debug(`Number of connected clients: ${sockets.size}`);
      }
    } catch (error) {}
  }

  handleDisconnect(client: any) {
    this.logger.debug(`Client id: ${client.id} disconnected`);
  }
}
