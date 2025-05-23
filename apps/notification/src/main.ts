import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { RedisIoAdapter } from '@app/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  const configService = app.get(ConfigService);
  const documentOptions = new DocumentBuilder()
    .setTitle('Notification App')
    .setDescription('Notification Manager')
    .setVersion('1.0')
    .addServer(
      `${configService.getOrThrow<string>('SWAGGER_SERVER_HOST')}`,
      'Server',
    )
    .addTag('Health')
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
      queue: configService.getOrThrow<string>(
        'RABBITMQ_NOTIFICATION_QUEUE_NAME',
      ),
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(
    configService.getOrThrow<string>('REDIS_HOST'),
    configService.getOrThrow<number>('REDIS_PORT'),
    configService.getOrThrow<string>('REDIS_PASSWORD'),
  );
  app.useWebSocketAdapter(redisIoAdapter);

  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('docs', app, document);
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT_NOTIFICATION'));
}
bootstrap();
