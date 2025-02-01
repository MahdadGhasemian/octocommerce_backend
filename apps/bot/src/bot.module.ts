import { Module } from '@nestjs/common';
import {
  AUTH_SERVICE,
  HealthModule,
  HttpCacheInterceptor,
  LoggerModule,
  NOTIFICATION_SERVICE,
  RabbitmqModule,
  STORE_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { UsersModule } from './users/users.module';
// import { TelegramsModule } from './telegrams/telegrams.module';
import { ScrapesModule } from './scrapes/scrapes.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_BOT: Joi.number().required(),
        REDIS_CACHE_KEY_PREFIX_BOT: Joi.string().required(),
      }),
    }),
    RabbitmqModule.forRoot(AUTH_SERVICE, 'RABBITMQ_AUTH_QUEUE_NAME'),
    RabbitmqModule.forRoot(
      NOTIFICATION_SERVICE,
      'RABBITMQ_NOTIFICATION_QUEUE_NAME',
    ),
    RabbitmqModule.forRoot(STORE_SERVICE, 'RABBITMQ_STORE_QUEUE_NAME'),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ttl: configService.get<number>('REDIS_CACHE_TTL_GLOBAL') || 60000,
          socket: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
          password: configService.getOrThrow<string>('REDIS_PASSWORD'),
        }),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    UsersModule,
    // TelegramsModule,
    ScrapesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (
        configService: ConfigService,
        cacheManager: any,
        reflector: Reflector,
      ) => {
        return new HttpCacheInterceptor(
          configService.getOrThrow<string>('REDIS_CACHE_KEY_PREFIX_BOT'),
          cacheManager,
          reflector,
        );
      },
      inject: [ConfigService, CACHE_MANAGER, Reflector],
    },
  ],
})
export class BotModule {}
