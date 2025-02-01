import { Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

export class PuppeteerManager {
  protected readonly logger = new Logger(PuppeteerManager.name);

  private browser;

  private page;

  private options;

  constructor(options = {}) {
    this.browser = null;
    this.page = null;
    this.options = {
      //   executablePath: environment.chromiumPath,
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--font-render-hinting=none',
        '--allow-file-access-from-files',
        '--enable-local-file-accesses',
      ],

      ignoreDefaultArgs: ['--disable-extensions'],
      ...options,
    };
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch(this.options);
      this.page = await this.browser.newPage();
    } catch (error) {
      this.logger.error('Error initializing Puppeteer:', error);
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    } else {
      this.logger.debug('No Puppeteer browser instance to close.');
    }
  }

  async performPageAction(action) {
    if (this.page) {
      try {
        await action(this.page);
      } catch (error) {
        this.logger.error('Error performing page action:', error);
      }
    } else {
      this.logger.debug('No Puppeteer page instance available.');
    }
  }
}
