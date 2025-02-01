import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagesModule } from '../message/messages.module';

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
  ],
  controllers: [BoardsController],
})
export class BoardsModule {}
