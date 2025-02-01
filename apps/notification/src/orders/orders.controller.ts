import { Controller, UseInterceptors } from '@nestjs/common';
import {
  DeliveryCreatedEvent,
  EVENT_NAME_DELIVERY_CREATED,
  EVENT_NAME_ORDER_CONFIRMED,
  EVENT_NAME_ORDER_CREATED,
  EVENT_NAME_ORDER_REJECTED,
  MessageAckInterceptor,
  OrderConfirmedEvent,
  OrderCreatedEvent,
  OrderRejectedEvent,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagesService } from '../message/messages.service';
import { InstantsService } from '../instants/instants.service';
import { ConfigService } from '@nestjs/config';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly instantsService: InstantsService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern(EVENT_NAME_ORDER_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async orderCreated(@Payload() payload: OrderCreatedEvent) {
    const { order } = payload;

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );

    const customer_info = order?.user?.mobile_phone;
    await this.messagesService.createOrderMessage(order);
    await this.instantsService.sendSMSOrderCreated(
      order?.user?.mobile_phone,
      order?.order_invoice_number,
      order?.total,
      order?.order_status,
    );
    await this.instantsService.sendSMSOrderCreatedInternal(
      support_mobile_phone,
      order?.order_invoice_number,
      customer_info,
    );
  }

  @EventPattern(EVENT_NAME_DELIVERY_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async deliveryCreated(@Payload() payload: DeliveryCreatedEvent) {
    const { delivery } = payload;

    await this.messagesService.createDeliveryMessage(delivery);
  }

  @EventPattern(EVENT_NAME_ORDER_CONFIRMED)
  @UseInterceptors(MessageAckInterceptor)
  async orderConfirmed(@Payload() payload: OrderConfirmedEvent) {
    const { order, order_link } = payload;

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );

    await this.instantsService.sendSMSOrderConfirmed(
      order?.user?.mobile_phone,
      order?.order_invoice_number,
      order_link,
      support_mobile_phone,
    );
    await this.instantsService.sendSMSOrderDownload(
      order?.user?.mobile_phone,
      order?.order_invoice_number,
      order?.pdf_file_url,
      support_mobile_phone,
    );
  }

  @EventPattern(EVENT_NAME_ORDER_REJECTED)
  @UseInterceptors(MessageAckInterceptor)
  async orderRejected(@Payload() payload: OrderRejectedEvent) {
    const { order } = payload;

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );
    await this.instantsService.sendSMSOrderRejected(
      order?.user?.mobile_phone,
      order?.order_invoice_number,
      order?.rejected_note,
      support_mobile_phone,
    );
  }
}
