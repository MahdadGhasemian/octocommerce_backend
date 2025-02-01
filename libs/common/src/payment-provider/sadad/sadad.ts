import axios from 'axios';
import * as crypto from 'crypto';
import * as API from './api';
import { Injectable, Logger } from '@nestjs/common';
import { BadConfigError, GatewayFailureError } from './exceptions';

export interface ISedadProvider {
  links?: {
    request?: string;
    verify?: string;
    payment?: string;
  };
  merchantId: string;
  terminalId: string;
  terminalKey: string;
}

export interface ISedadRequestPayment {
  amount: number;
  returnUrl: string;
  mobile?: string;
  orderId: string;
  appName?: string;
}

export interface ISedadVerifyPayment {
  HashedCardNo: string;
  ResCode: number | string;
  Token: string;
}

@Injectable()
export class SedadProvider {
  protected readonly logger = new Logger(SedadProvider.name);

  constructor(private readonly config: ISedadProvider) {
    const defaultLinks = {
      request: 'https://sadad.shaparak.ir/api/v0/Request/PaymentRequest',
      verify: 'https://sadad.shaparak.ir/api/v0/Advice/Verify',
      payment: 'https://sadad.shaparak.ir/Purchase',
    };

    this.config = {
      ...config,
      links: { ...defaultLinks, ...config.links },
    };
  }

  public async requestPayment(options: ISedadRequestPayment) {
    const { amount, returnUrl, orderId } = options;

    const localDateTime = new Date().toISOString();
    const signData = this.encryptPKCS7(
      `${this.config.terminalId};${orderId};${amount}`,
      this.config.terminalKey,
    );

    const requestData = {
      TerminalId: this.config.terminalId,
      MerchantId: this.config.merchantId,
      Amount: amount,
      SignData: signData,
      ReturnUrl: returnUrl,
      LocalDateTime: localDateTime,
      OrderId: orderId,
      // ApplicationName: appName ? appName : undefined,
      // UserId: mobile ? +mobile : undefined,
    };

    const response = await axios.post<
      API.RequestPaymentReq,
      { data: API.RequestPaymentRes }
    >(this.config.links.request, requestData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    if (String(response.data.ResCode) !== '0') {
      this.throwError(response.data?.ResCode?.toString() || '');
    }

    return {
      token: response.data.Token,
      url: this.config.links.payment,
    };
  }

  public async verifyPayment(options: ISedadVerifyPayment) {
    const { HashedCardNo, ResCode, Token } = options;

    if (String(ResCode) !== '0') {
      this.throwError(ResCode.toString());
    }

    const response = await axios.post<
      API.VerifyPaymentReq,
      { data: API.VerifyPaymentRes }
    >(this.config.links.verify, {
      SignData: this.encryptPKCS7(Token, this.config.terminalKey),
      Token,
    });

    const {
      ResCode: verificationResCode,
      SystemTraceNo,
      RetrivalRefNo,
    } = response.data;

    if (String(verificationResCode) !== '0') {
      this.throwError(verificationResCode.toString());
    }

    return {
      transactionId: SystemTraceNo,
      cardPan: HashedCardNo,
      retrivalRefNo: RetrivalRefNo,
      raw: options,
    };
  }

  // Encrypts data using PKCS7 padding with 3DES encryption
  private encryptPKCS7(message: string, key: string): string {
    const decodedKey = Buffer.from(key, 'base64');
    const cipher = crypto.createCipheriv('des-ede3', decodedKey, null);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return encrypted;
  }

  private throwError(errorCode: string) {
    const message = API.requestErrors[errorCode] ?? API.verifyErrors[errorCode];
    if (API.IPGConfigErrors.includes(errorCode))
      throw new BadConfigError({ message, isIPGError: true, code: errorCode });
    throw new GatewayFailureError({ message, code: errorCode });
  }
}
