import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { UsersRepository } from '../users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Category,
  Inventory,
  InventoryItem,
  Order,
  OrderItem,
  Product,
  Stock,
  User,
  Warehouse,
} from '@app/store';
import { ProductsRepository } from '../products/products.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { StocksRepository } from '../inventory/stocks.repository';

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
    TypeOrmModule.forFeature([
      User,
      Product,
      Category,
      Order,
      OrderItem,
      Stock,
      Warehouse,
      Inventory,
      InventoryItem,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    UsersRepository,
    ProductsRepository,
    OrdersRepository,
    StocksRepository,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
