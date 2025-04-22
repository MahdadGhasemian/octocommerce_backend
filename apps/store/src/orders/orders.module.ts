import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@app/common';
import { OrdersRepository } from './orders.repository';
import { OrderItemsRepository } from './order-items.repository';
import { ProductsModule } from '../products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettingsModule } from '../settings/settings.module';
import { ContactsModule } from '../contacts/contacts.module';
import { Delivery, Order, OrderItem, User } from '@app/store';
import { DeliveryMethodsModule } from '../delivery-methods/delivery-methods.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Order, OrderItem, Delivery]),
    ProductsModule,
    SettingsModule,
    ContactsModule,
    DeliveryMethodsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository, OrderItemsRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
