import { Controller, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_PAYMENT_COMPLETED,
  EVENT_NAME_PAYMENT_CONFIRMED,
  EVENT_NAME_PAYMENT_CREATED,
  EVENT_NAME_PAYMENT_REJECTED,
  MessageAckInterceptor,
  PaymentCompletedEvent,
  PaymentConfirmedEvent,
  PaymentCreatedEvent,
  PaymentRejectedEvent,
  PaymentType,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagesService } from '../message/messages.service';
import { InstantsService } from '../instants/instants.service';
import { ConfigService } from '@nestjs/config';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly instantsService: InstantsService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern(EVENT_NAME_PAYMENT_CREATED)
  @UseInterceptors(MessageAckInterceptor)
  async paymentCreated(@Payload() payload: PaymentCreatedEvent) {
    const { payment } = payload;

    await this.messagesService.createPaymentMessage(payment);
  }

  @EventPattern(EVENT_NAME_PAYMENT_CONFIRMED)
  @UseInterceptors(MessageAckInterceptor)
  async paymentConfirmed(@Payload() payload: PaymentConfirmedEvent) {
    const { payment, totalPaidAmount } = payload;

    await this.instantsService.sendSMSPaymentConfirmed(
      payment?.user?.mobile_phone,
      payment?.order.order_invoice_number,
      totalPaidAmount?.toString(),
    );
  }

  @EventPattern(EVENT_NAME_PAYMENT_REJECTED)
  @UseInterceptors(MessageAckInterceptor)
  async paymentRejected(@Payload() payload: PaymentRejectedEvent) {
    const { payment } = payload;

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );
    await this.instantsService.sendSMSPaymentRejected(
      payment?.user?.mobile_phone,
      payment?.order.order_invoice_number,
      payment?.rejected_note,
      support_mobile_phone,
    );
  }

  @EventPattern(EVENT_NAME_PAYMENT_COMPLETED)
  @UseInterceptors(MessageAckInterceptor)
  async paymentCompleted(@Payload() payload: PaymentCompletedEvent) {
    const { payment, totalPaidAmount } = payload;
    const { payment_type } = payment;

    const support_mobile_phone = this.configService.get(
      'SALE_SUPPORT_PHONE_NUMBER_1',
    );

    if (payment_type === PaymentType.ONLINE) {
      await this.instantsService.sendSMSPaymentCompleted1(
        payment?.user?.mobile_phone,
        payment?.order.order_invoice_number,
        totalPaidAmount?.toString(),
      );
      await this.instantsService.sendSMSPaymentCompletedInternal(
        support_mobile_phone,
        payment?.order.order_invoice_number,
      );
    } else {
      await this.instantsService.sendSMSPaymentCompleted2(
        payment?.user?.mobile_phone,
        payment?.order.order_invoice_number,
        totalPaidAmount?.toString(),
      );
    }
  }
}
