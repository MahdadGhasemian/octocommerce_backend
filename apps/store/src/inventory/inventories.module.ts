import { Module } from '@nestjs/common';
import { InventoriesController } from './inventories.controller';
import { InventoriesService } from './inventories.service';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { InventoriesRepository } from './inventories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryItemsRepository } from './inventory-items.repository';
import { InventoryItemsService } from './inventory-items.service';
import { StocksRepository } from './stocks.repository';
import { StocksService } from './stocks.service';
import { Inventory, InventoryItem, Stock, Warehouse } from '@app/store';
import { WarehousesRepository } from '../warehouse/warehouses.repository';
import { OrdersModule } from '../orders/orders.module';

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
    TypeOrmModule.forFeature([Warehouse, InventoryItem, Inventory, Stock]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    HealthModule,
    OrdersModule,
  ],
  controllers: [InventoriesController],
  providers: [
    InventoriesService,
    InventoriesRepository,
    InventoryItemsRepository,
    InventoryItemsService,
    StocksRepository,
    StocksService,
    WarehousesRepository,
  ],
  exports: [InventoriesService],
})
export class InventoriesModule {}
