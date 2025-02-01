import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from '../message/messages.module';
import { InstantsModule } from '../instants/instants.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_NOTIFICATION'),
      }),
      inject: [ConfigService],
    }),
    MessagesModule,
    InstantsModule,
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
