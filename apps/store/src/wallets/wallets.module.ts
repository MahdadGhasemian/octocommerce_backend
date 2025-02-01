import { Module } from '@nestjs/common';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { WalletsRepository } from './wallets.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletTransactionsRepository } from './wallet-transactions.repository';
import { User, Wallet, WalletTransaction } from '@app/store';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Wallet, WalletTransaction]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [WalletsController],
  providers: [
    WalletsService,
    WalletsRepository,
    WalletTransactionsService,
    WalletTransactionsRepository,
  ],
  exports: [WalletsService, WalletTransactionsService],
})
export class WalletsModule {}
