import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);
  const configService = app.get(ConfigService);
  const documentOptions = new DocumentBuilder()
    .setTitle('Bot App')
    .setDescription('Bot Manager')
    .setVersion('1.0')
    .addServer(
      `${configService.getOrThrow<string>('SWAGGER_SERVER_HOST')}`,
      'Server',
    )
    .addTag('Health')
    .addTag('Scrapes')
    .build();

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS').split(','),
    credentials: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      queue: configService.getOrThrow<string>('RABBITMQ_BOT_QUEUE_NAME'),
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT_BOT'));
}
bootstrap();
