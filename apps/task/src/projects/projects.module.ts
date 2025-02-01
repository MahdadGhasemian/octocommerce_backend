import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { DatabaseModule, HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ProjectsRepository } from './projects.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Board,
  Comment,
  Content,
  Group,
  Label,
  Project,
  User,
} from '@app/task';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule,
    DatabaseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DATABASE_TASK'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Group,
      Label,
      Board,
      Comment,
      Content,
      Project,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_TASK: Joi.number().required(),
      }),
    }),
    HealthModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsService],
})
export class ProjectsModule {}
