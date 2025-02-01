import { Module } from '@nestjs/common';
import { DeliveryMethodsController } from './delivery-methods.controller';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryMethod } from '@app/store';
import { DeliveryMethodsService } from './delivery-methods.service';
import { DeliveryMethodsRepository } from './delivery-methods.repository';

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
    TypeOrmModule.forFeature([DeliveryMethod]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [DeliveryMethodsController],
  providers: [DeliveryMethodsService, DeliveryMethodsRepository],
  exports: [DeliveryMethodsService],
})
export class DeliveryMethodsModule {}
