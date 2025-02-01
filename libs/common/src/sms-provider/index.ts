import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsProvider {
  protected readonly logger = new Logger(SmsProvider.name);

  constructor(
    private readonly url: string,
    private readonly username: string,
    private readonly password: string,
    private readonly templateList: {
      code_account_1: string;
      code_account_2: string;
      code_account_3: string;
      code_account_4: string;
      code_account_5: string;
      code_order_1: string;
      code_order_2: string;
      code_order_3: string;
      code_order_4: string;
      code_order_5: string;
      code_order_6: string;
      code_payment_1: string;
      code_payment_2: string;
      code_payment_3: string;
      code_payment_4: string;
      code_payment_5: string;
      code_payment_6: string;
      code_delivery_1: string;
      code_delivery_2: string;
      code_delivery_3: string;
      code_delivery_4: string;
      code_delivery_5: string;
      code_promotion_1: string;
      code_promotion_2: string;
      code_support_1: string;
      code_support_2: string;
      code_support_3: string;
      code_internal_1: string;
      code_internal_2: string;
      code_internal_3: string;
    },
  ) {}

  public async sendSMSGeneral(
    mobile_phone: string,
    title_type: string,
    text_list: string[],
  ) {
    const text = text_list;
    const bodyId = this.templateList[title_type];
    return this.sendSMSByMelipayamakWithTemplate(mobile_phone, bodyId, text);
  }

  private async sendSMSByMelipayamakWithTemplate(
    to: string,
    bodyId: string,
    text: Array<number | string>,
  ) {
    return this.sendSMS(text.join(';'), to, bodyId);
  }

  private async sendSMS(text: string, to: string, bodyId: string) {
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      username: this.username,
      password: this.password,
      text,
      to,
      bodyId,
    };

    try {
      const response = await axios.post(this.url, data, { headers });
      const { Value, RetStatus, StrRetStatus } = response.data;

      if (RetStatus !== 1) {
        const error = `SMS sending failed!  Value=${Value} RetStatus=${RetStatus} StrRetStatus=${StrRetStatus}`;
        this.logger.debug(error);
      }

      return response.data;
    } catch (error) {
      this.logger.error(error);
      return true;
    }
  }
}
