import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { MessagesRepository } from './messages.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Message, User } from '@app/notification';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_NOTIFICATION'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Message]),
  ],
  controllers: [MessagesController],
  providers: [MessagesGateway, MessagesService, MessagesRepository],
  exports: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
