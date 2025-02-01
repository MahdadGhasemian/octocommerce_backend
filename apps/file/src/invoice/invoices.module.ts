import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { HealthModule, LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PdfGenerator } from './pdf-generator';

@Module({
  imports: [LoggerModule.forRoot(), ConfigModule, HealthModule],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    {
      provide: PdfGenerator,
      useFactory: async (configService: ConfigService) =>
        new PdfGenerator(
          configService.getOrThrow('CHROMIUM_PATH'),
          configService.getOrThrow('CLIENT_TIMEZONE'),
          configService.getOrThrow('INVOICE_TEMPLATE_PATH'),
          configService.getOrThrow('INVOICE_GENERATE_TEMPORARY_PATH'),
          configService.getOrThrow('INVOICE_UPLOAD_URL'),
        ),
      inject: [ConfigService],
    },
  ],
  exports: [InvoicesService],
})
export class InvoicesModule {}
