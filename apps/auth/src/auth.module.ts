import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  BOT_SERVICE,
  HealthModule,
  HttpCacheInterceptor,
  LoggerModule,
  NOTIFICATION_SERVICE,
  RabbitmqModule,
  STORE_SERVICE,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { AccessesModule } from './accesses/accesses.module';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_AUTH: Joi.number().required(),
        OTP_SMS_EXPIRATION: Joi.number().required(),
        OTP_EMAIL_EXPIRATION: Joi.number().required(),
        COOKIE_CONFIG_SECURE: Joi.boolean().required(),
        COOKIE_CONFIG_SAME_SITE: Joi.string().required(),
        COOKIE_CONFIG_DOMAIN: Joi.string().required(),
        DEFAULT_ACCESS_ID: Joi.number().required(),
        DEFAULT_USER_FIRST_NAME: Joi.string().required(),
        DEFAULT_USER_LAST_NAME: Joi.string().required(),
        REDIS_CACHE_KEY_PREFIX_AUTH: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    RabbitmqModule.forRoot(STORE_SERVICE, 'RABBITMQ_STORE_QUEUE_NAME'),
    RabbitmqModule.forRoot(
      NOTIFICATION_SERVICE,
      'RABBITMQ_NOTIFICATION_QUEUE_NAME',
    ),
    RabbitmqModule.forRoot(BOT_SERVICE, 'RABBITMQ_BOT_QUEUE_NAME'),
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
    AccessesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (
        configService: ConfigService,
        cacheManager: any,
        reflector: Reflector,
      ) => {
        return new HttpCacheInterceptor(
          configService.getOrThrow<string>('REDIS_CACHE_KEY_PREFIX_AUTH'),
          cacheManager,
          reflector,
        );
      },
      inject: [ConfigService, CACHE_MANAGER, Reflector],
    },
  ],
})
export class AuthModule {}
