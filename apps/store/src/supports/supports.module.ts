import { Module } from '@nestjs/common';
import { SupportsService } from './supports.service';
import { SupportsController } from './supports.controller';
import { DatabaseModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShortMessagesRepository } from './short-messages.repository';
import { ShortMessage, User } from '@app/store';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, ShortMessage]),
  ],
  controllers: [SupportsController],
  providers: [SupportsService, ShortMessagesRepository],
  exports: [SupportsService],
})
export class SupportsModule {}
