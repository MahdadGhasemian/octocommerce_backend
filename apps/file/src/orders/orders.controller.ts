import { Controller, UseInterceptors } from '@nestjs/common';
import {
  EVENT_NAME_ORDER_CONFIRMED,
  EVENT_NAME_ORDER_REGENERATE_INVOICE,
  MessageAckInterceptor,
  OrderConfirmedEvent,
  OrderRegenerateInvoiceEvent,
} from '@app/common';

import { EventPattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from '../invoice/invoices.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @EventPattern(EVENT_NAME_ORDER_CONFIRMED)
  @UseInterceptors(MessageAckInterceptor)
  async orderConfirmed(@Payload() payload: OrderConfirmedEvent) {
    await this.invoicesService.generatePdfInvoice(payload.order);
  }

  @EventPattern(EVENT_NAME_ORDER_REGENERATE_INVOICE)
  @UseInterceptors(MessageAckInterceptor)
  async regenerateOrderInvoice(
    @Payload() payload: OrderRegenerateInvoiceEvent,
  ) {
    await this.invoicesService.generatePdfInvoice(payload.order);
  }
}
