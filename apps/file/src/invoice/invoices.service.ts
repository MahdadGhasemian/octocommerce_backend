import { InvoiceData, PdfGenerator } from './pdf-generator';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class InvoicesService {
  protected readonly logger = new Logger(InvoicesService.name);

  constructor(private readonly pdfGenerator: PdfGenerator) {}

  async generatePdfInvoice(orderData: InvoiceData) {
    return this.pdfGenerator.generateInvoiceHtmlFile(orderData);
  }
}
