import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as momentJalaali from 'moment-jalaali';
import * as momentTimezone from 'moment-timezone';
import { Injectable, Logger } from '@nestjs/common';
import { PuppeteerManager } from './PuppeteerManager';
import axios from 'axios';
import * as FormData from 'form-data';

enum MaterialUnit {
  Number = 'number',
  Kilogram = 'kg',
  Meter = 'm',
  Box = 'box',
  Roll = 'roll',
  Device = 'device',
}

const MaterialUnitMap = new Map<MaterialUnit, string>([
  [MaterialUnit.Number, 'عدد'],
  [MaterialUnit.Kilogram, 'کیلوگرم'],
  [MaterialUnit.Meter, 'متر'],
  [MaterialUnit.Box, 'باکس'],
  [MaterialUnit.Roll, 'رول'],
  [MaterialUnit.Device, 'دستگاه'],
]);

export type InvoiceData = {
  pdf_file_name: string;
};

@Injectable()
export class PdfGenerator {
  protected readonly logger = new Logger(PdfGenerator.name);
  private readonly generatedHtmlFiles: Map<string, string> = new Map();

  constructor(
    private readonly chromiumPath: string,
    private readonly clientTimezone: string,
    private readonly templatePath: string,
    private readonly temporaryGeneratePath: string,
    private readonly uploadUrl: string,
  ) {}

  async generateInvoiceHtmlFile(invoiceData: InvoiceData) {
    const fileName = invoiceData.pdf_file_name;

    if (!fileName) return;

    const pdfOutputPath = path.join(this.temporaryGeneratePath, fileName);

    await this.generateHtmlFiles(invoiceData);
    await this.runPuppeter(pdfOutputPath);
    await this.uploadPdfFile(pdfOutputPath);
  }

  private async runPuppeter(pdfOutputPath: string) {
    return new Promise((resolve, reject) => {
      const puppeteerManager = new PuppeteerManager({
        executablePath: this.chromiumPath,
      });
      puppeteerManager.initialize().then(async () => {
        await puppeteerManager.performPageAction(async (page) => {
          const bodyTemplate = this.generatedHtmlFiles.get('invoice-body.html');
          const headerTemplate = this.generatedHtmlFiles.get(
            'invoice-header.html',
          );
          const footerTemplate = this.generatedHtmlFiles.get(
            'invoice-footer.html',
          );

          if (!bodyTemplate || !headerTemplate || !footerTemplate) {
            this.logger.error('Missing HTML templates');
            reject('Missing HTML templates');
          }

          await page.setContent(bodyTemplate);
          await page.emulateMediaType('screen');
          await page.pdf({
            path: pdfOutputPath,
            displayHeaderFooter: true,
            margin: {
              top: '56px',
              right: '32px',
              bottom: '56px',
              left: '32px',
            },
            printBackground: true,
            format: 'A5',
            landscape: true,
            headerTemplate,
            footerTemplate,
          });
        });

        puppeteerManager.close();

        return resolve(pdfOutputPath);
      });
    });
  }

  private async generateHtmlFiles(data: any) {
    const templateNames = [
      'invoice-header.hbs',
      'invoice-body.hbs',
      'invoice-footer.hbs',
    ];

    for (const templateName of templateNames) {
      // const templatePath = path.join(__dirname, 'templates', templateName);
      const templatePath = path.join(this.templatePath, templateName);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const outputName = templateName.replace('.hbs', '.html');

      handlebars.registerHelper('incremented', (index) => index + 1);
      handlebars.registerHelper('subTotal', (a, b) =>
        new Intl.NumberFormat().format(a * b * 10).toLocaleString(),
      );
      handlebars.registerHelper('material', (unit) =>
        MaterialUnitMap.get(unit),
      );
      handlebars.registerHelper('diffInDay', (date1, date2) => {
        if (!date1 || !date2) return '';

        const inputDate1 = momentTimezone(date1)
          .tz(this.clientTimezone)
          .startOf('day');
        const inputDate2 = momentTimezone(date2)
          .tz(this.clientTimezone)
          .startOf('day');

        return inputDate1.diff(inputDate2, 'days');
      });
      handlebars.registerHelper('currency', (value) =>
        new Intl.NumberFormat().format(value * 10).toLocaleString(),
      );
      handlebars.registerHelper('dateformat', (date) =>
        momentJalaali(date).format('jYYYY/jMM/jDD'),
      );
      handlebars.registerHelper('description', (text) =>
        text?.length > 176 ? `${text?.substring(1, 176)} ...` : text,
      );

      const template = handlebars.compile(templateSource);
      const renderedHtml = template(data);

      this.generatedHtmlFiles.set(outputName, renderedHtml);
    }
  }

  private async uploadPdfFile(filePath: string) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      }

      const fileName = path.basename(filePath);
      const fileBuffer = fs.readFileSync(filePath);

      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: fileName,
        contentType: 'application/pdf',
      });

      const response = await axios.post(this.uploadUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.status === 200 || response.status === 201) {
        return 'File uploaded successfully';
      } else {
        return `Upload failed with status: ${response.status}`;
      }
    } catch (error) {
      this.logger.error(error);
      return true;
    }
  }
}
