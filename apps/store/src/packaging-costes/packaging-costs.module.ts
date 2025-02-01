import { Module } from '@nestjs/common';
import { PackagingCostsController } from './packaging-costs.controller';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagingCost } from '@app/store';
import { PackagingCostsService } from './packaging-costs.service';
import { PackagingCostsRepository } from './packaging-costs.repository';

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
    TypeOrmModule.forFeature([PackagingCost]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_STORE: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [PackagingCostsController],
  providers: [PackagingCostsService, PackagingCostsRepository],
  exports: [PackagingCostsService],
})
export class PackagingCostsModule {}
