import { Module } from '@nestjs/common';
import { TelegramsUpdate } from './telegrams.update';
import { TelegramsService } from './telegrams.service';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TelegramsRepository } from './telegrams.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telegram, User } from '@app/bot';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { Redis } from '@telegraf/session/redis';
import { TelegramsController } from './telegrams.controller';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_BOT'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Telegram]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_BOT: Joi.number().required(),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
      }),
    }),
    TelegrafModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        token: configService.getOrThrow('TELEGRAM_BOT_TOKEN'),
        middlewares: [
          session({
            store: Redis({
              url: `redis://:${configService.getOrThrow<string>('REDIS_PASSWORD')}@${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<number>('REDIS_PORT')}`,
            }),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    HealthModule,
  ],
  controllers: [TelegramsController],
  providers: [TelegramsUpdate, TelegramsService, TelegramsRepository],
})
export class TelegramsModule {}
