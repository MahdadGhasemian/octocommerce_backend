import { Module } from '@nestjs/common';
import { ScrapesService } from './scrapes.service';
import { ScrapesController } from './scrapes.controller';
import { DatabaseModule } from '@app/common';
import { ScrapesRepository } from './scrapes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Scrape } from '@app/bot';
import { ScheduleModule } from '@nestjs/schedule';
import { ScrapeHelper } from './scrape-helper';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_BOT'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Scrape]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ScrapesController],
  providers: [
    ScrapesService,
    ScrapesRepository,
    {
      provide: ScrapeHelper,
      useFactory: async (configService: ConfigService) =>
        new ScrapeHelper(
          configService.getOrThrow('ZAGROSELEC_STORE_KEY_NAME'),
          configService.getOrThrow('ZAGROSELEC_TARGET_BASE_URL'),
          configService.getOrThrow('ZAGROSELEC_STORE_STOCK_TARGET_BASE_URL'),
        ),
      inject: [ConfigService],
    },
  ],
  exports: [ScrapesService],
})
export class ScrapesModule {}
