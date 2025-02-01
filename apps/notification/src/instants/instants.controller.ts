import {
  EVENT_NAME_SEND_SEND_SMS_ACCOUNT_OTP,
  EVENT_NAME_SEND_SEND_SMS_GENERAL,
  MessageAckInterceptor,
  NoCache,
  SendShortMessageAccountOtpEvent,
  SendShortMessageGeneralEvent,
} from '@app/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { InstantsService } from './instants.service';

@ApiTags('Instants')
@NoCache()
@Controller('instants')
export class InstantsController {
  constructor(private readonly instantsService: InstantsService) {}

  @EventPattern(EVENT_NAME_SEND_SEND_SMS_GENERAL)
  @UseInterceptors(MessageAckInterceptor)
  async sendSms(@Payload() payload: SendShortMessageGeneralEvent) {
    const { mobile_phone, title_type, text_list } = payload;

    await this.instantsService.sendSmsPanel(
      mobile_phone,
      title_type,
      text_list,
    );
  }

  @EventPattern(EVENT_NAME_SEND_SEND_SMS_ACCOUNT_OTP)
  @UseInterceptors(MessageAckInterceptor)
  async sendSmsAccountOtp(@Payload() payload: SendShortMessageAccountOtpEvent) {
    const { mobile_phone, otp } = payload;

    await this.instantsService.sendSmsAccountOtp(mobile_phone, otp);
  }
}
