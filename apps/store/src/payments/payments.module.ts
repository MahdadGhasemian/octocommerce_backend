import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, User } from '@app/store';
import { PaymentsRepository } from './payments.repository';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule, SedadProvider } from '@app/common';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Payment]),
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    {
      provide: SedadProvider,
      useFactory: async (configService: ConfigService) =>
        new SedadProvider({
          merchantId: configService.getOrThrow('PAYMENT_SADAD_MERCHANT_ID'),
          terminalId: configService.getOrThrow('PAYMENT_SADAD_TERMINAL_ID'),
          terminalKey: configService.getOrThrow('PAYMENT_SADAD_TERMINAL_KEY'),
        }),
      inject: [ConfigService],
    },
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
