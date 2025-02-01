import { Module } from '@nestjs/common';
import { InstantsController } from './instants.controller';
import { InstantsService } from './instants.service';
import { HealthModule, LoggerModule, SmsProvider } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [LoggerModule.forRoot(), ConfigModule, HealthModule],
  controllers: [InstantsController],
  providers: [
    InstantsService,
    {
      provide: SmsProvider,
      useFactory: async (configService: ConfigService) =>
        new SmsProvider(
          configService.getOrThrow('SMS_MELIPEYAMAK_URL'),
          configService.getOrThrow('SMS_MELIPEYAMAK_USERNAME'),
          configService.getOrThrow('SMS_MELIPEYAMAK_PASSWORD'),
          {
            code_account_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ACCOUNT_1',
            ),
            code_account_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ACCOUNT_2',
            ),
            code_account_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ACCOUNT_3',
            ),
            code_account_4: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ACCOUNT_4',
            ),
            code_account_5: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ACCOUNT_5',
            ),
            code_order_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_1',
            ),
            code_order_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_2',
            ),
            code_order_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_3',
            ),
            code_order_4: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_4',
            ),
            code_order_5: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_5',
            ),
            code_order_6: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_ORDER_6',
            ),
            code_payment_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_1',
            ),
            code_payment_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_2',
            ),
            code_payment_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_3',
            ),
            code_payment_4: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_4',
            ),
            code_payment_5: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_5',
            ),
            code_payment_6: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PAYMENT_6',
            ),
            code_delivery_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_DELIVERY_1',
            ),
            code_delivery_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_DELIVERY_2',
            ),
            code_delivery_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_DELIVERY_3',
            ),
            code_delivery_4: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_DELIVERY_4',
            ),
            code_delivery_5: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_DELIVERY_5',
            ),
            code_promotion_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PROMOTION_1',
            ),
            code_promotion_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_PROMOTION_2',
            ),
            code_support_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_SUPPORT_1',
            ),
            code_support_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_SUPPORT_2',
            ),
            code_support_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_SUPPORT_3',
            ),
            code_internal_1: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_INTERAL_1',
            ),
            code_internal_2: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_INTERAL_2',
            ),
            code_internal_3: configService.getOrThrow(
              'SMS_MELIPEYAMAK_TEMPLATE_INTERAL_3',
            ),
          },
        ),
      inject: [ConfigService],
    },
  ],
  exports: [InstantsService],
})
export class InstantsModule {}
