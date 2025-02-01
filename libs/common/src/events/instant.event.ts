import { SmsTitleType } from '../enum';

export class SendShortMessageSentEvent {
  constructor(
    public readonly mobile_phone: string,
    public readonly title_type: SmsTitleType,
    public readonly text_list: string[],
  ) {}
}

export class SendShortMessageGeneralEvent {
  constructor(
    public readonly mobile_phone: string,
    public readonly title_type: SmsTitleType,
    public readonly text_list: string[],
  ) {}
}

export class SendShortMessageAccountOtpEvent {
  constructor(
    public readonly mobile_phone: string,
    public readonly otp: string,
  ) {}
}
