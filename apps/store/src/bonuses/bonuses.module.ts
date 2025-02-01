import { Module } from '@nestjs/common';
import { BonusesService } from './bonuses.service';
import { BonusesController } from './bonuses.controller';
import { DatabaseModule } from '@app/common';
import { BonusesRepository } from './bonuses.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Bonus } from '@app/store';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_STORE'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Bonus]),
  ],
  controllers: [BonusesController],
  providers: [BonusesService, BonusesRepository],
  exports: [BonusesService],
})
export class BonusesModule {}
