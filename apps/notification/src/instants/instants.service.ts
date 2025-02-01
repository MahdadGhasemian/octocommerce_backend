import {
  EVENT_NAME_SEND_SEND_SMS_SENT,
  SendShortMessageSentEvent,
  SmsProvider,
  SmsTitleType,
  STORE_SERVICE,
} from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class InstantsService {
  protected readonly logger = new Logger(InstantsService.name);

  constructor(
    private readonly smsProvider: SmsProvider,
    private readonly configService: ConfigService,
    @Inject(STORE_SERVICE) private readonly storeClient: ClientProxy,
  ) {}

  // Send SMS Panel
  async sendSmsPanel(
    mobile_phone: string,
    title_type: SmsTitleType,
    text_list: string[],
  ) {
    return this.sendSms(mobile_phone, title_type, text_list);
  }

  // Account OTP
  async sendSmsAccountOtp(mobile_phone: string, otp: string) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ACCOUNT_1, [
      otp,
    ]);
  }

  // User Created
  async sendSMSUserCreatedBySystem(
    mobile_phone: string,
    user_mobile_phone: string,
    support_mobile_phone: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ACCOUNT_2, [
      user_mobile_phone,
      support_mobile_phone,
    ]);
  }

  // User Welcome
  async sendSMSUserWelcome(mobile_phone: string, support_mobile_phone: string) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ACCOUNT_5, [
      support_mobile_phone,
    ]);
  }

  // Order Created
  async sendSMSOrderCreated(
    mobile_phone: string,
    invoice_number: string,
    amount: string,
    status: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ORDER_1, [
      invoice_number,
      amount,
      status,
    ]);
  }

  // Order Confirmed
  async sendSMSOrderConfirmed(
    mobile_phone: string,
    invoice_number: string,
    order_link: string,
    support_mobile_phone: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ORDER_4, [
      invoice_number,
      order_link,
      support_mobile_phone,
    ]);
  }

  // Order Rejected
  async sendSMSOrderRejected(
    mobile_phone: string,
    invoice_number: string,
    rejected_note: string,
    support_mobile_phone: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ORDER_6, [
      invoice_number,
      rejected_note,
      support_mobile_phone,
    ]);
  }

  // Order Download
  async sendSMSOrderDownload(
    mobile_phone: string,
    invoice_number: string,
    download_link: string,
    support_mobile_phone: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_ORDER_5, [
      invoice_number,
      download_link,
      support_mobile_phone,
    ]);
  }

  //  Payment Confirmed
  async sendSMSPaymentConfirmed(
    mobile_phone: string,
    invoice_number: string,
    amount: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_PAYMENT_4, [
      invoice_number,
      amount,
    ]);
  }

  // Payment Rejected
  async sendSMSPaymentRejected(
    mobile_phone: string,
    invoice_number: string,
    rejected_note: string,
    support_mobile_phone: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_PAYMENT_5, [
      invoice_number,
      rejected_note,
      support_mobile_phone,
    ]);
  }

  // Payment Completed
  async sendSMSPaymentCompleted1(
    mobile_phone: string,
    invoice_number: string,
    amount: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_PAYMENT_1, [
      invoice_number,
      amount,
    ]);
  }

  // Payment Completed 2
  async sendSMSPaymentCompleted2(
    mobile_phone: string,
    invoice_number: string,
    amount: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_PAYMENT_6, [
      invoice_number,
      amount,
    ]);
  }

  // Order Created (Internal)
  async sendSMSOrderCreatedInternal(
    mobile_phone: string,
    invoice_number: string,
    info: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_INTERNAL_1, [
      invoice_number,
      info,
    ]);
  }

  // Order Paid (Internal)
  async sendSMSPaymentCompletedInternal(
    mobile_phone: string,
    invoice_number: string,
  ) {
    return this.sendSmsBySystem(mobile_phone, SmsTitleType.CODE_INTERNAL_2, [
      invoice_number,
    ]);
  }

  private async sendSms(
    mobile_phone: string,
    title_type: SmsTitleType,
    text_list: string[],
  ) {
    return this.sendSMSOrDevelopmentLogging(
      () =>
        this.smsProvider.sendSMSGeneral(mobile_phone, title_type, text_list),
      title_type,
      mobile_phone,
      ...text_list,
    );
  }

  private async sendSmsBySystem(
    mobile_phone: string,
    title_type: SmsTitleType,
    text_list: string[],
  ) {
    await this.sendSMSOrDevelopmentLogging(
      () =>
        this.smsProvider.sendSMSGeneral(mobile_phone, title_type, text_list),
      title_type,
      mobile_phone,
      ...text_list,
    );

    this.storeClient.emit(
      EVENT_NAME_SEND_SEND_SMS_SENT,
      new SendShortMessageSentEvent(mobile_phone, title_type, text_list),
    );
  }

  private async sendSMSOrDevelopmentLogging(
    func: () => Promise<any>,
    description,
    ...args: any[]
  ) {
    const nodeEnv = this.configService.get('NODE_ENV');

    if (nodeEnv === 'development') {
      this.logger.log({
        description: `${description} ==================================`,
        ...args,
      });

      return;
    }

    return func();
  }
}
