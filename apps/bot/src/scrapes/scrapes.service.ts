import {
  AvailableQuantityUpdateByRenewProcessEvent,
  EVENT_NAME_AVAILABLE_QUANTITY_BY_RENEW_PROCESS_UPDATE,
  EVENT_NAME_PRODUCT_SALE_PRICE_UPDATE,
  EVENT_NAME_READ_PRODUCTS,
  STORE_SERVICE,
} from '@app/common';
import {
  ProductReadFiltersEvent,
  ProductSalePriceUpdateEvent,
} from '@app/common/events/product.event';
import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import { ScrapeHelper } from './scrape-helper';
import { ScrapesRepository } from './scrapes.repository';
import { Scrape } from '@app/bot';
import { randomBytes } from 'crypto';

@Injectable()
export class ScrapesService {
  protected readonly logger = new Logger(ScrapesService.name);
  private job_is_running = false;

  constructor(
    private readonly scrapesRepository: ScrapesRepository,
    @Inject(STORE_SERVICE) private readonly storeClient: ClientProxy,
    private readonly scrapeHelper: ScrapeHelper,
  ) {}

  async readJobStatus() {
    return { job_is_running: this.job_is_running };
  }

  async triggerJob() {
    if (this.job_is_running) {
      throw new ConflictException('The job is already running.');
    }

    this.job_is_running = true;
    this.startJob();

    return { job_is_running: this.job_is_running };
  }

  async forceStopJob() {
    if (this.job_is_running) {
      this.job_is_running = false;
    }

    return { job_is_running: this.job_is_running };
  }

  // Runs every day at midnight
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // handleMidnightJob() {
  //   this.job_is_running = true;
  //   this.startJob();
  // }

  private async startJob() {
    const session_id = randomBytes(16).toString('hex');
    const pageSize = 100;

    // read total pages
    const fetchedTotal = await lastValueFrom(
      this.storeClient.send(
        EVENT_NAME_READ_PRODUCTS,
        new ProductReadFiltersEvent({
          page: 1,
          limit: pageSize,
          path: 'products',
        }),
      ),
    );
    const totalPages = fetchedTotal.meta.totalPages;

    // read bulk product and scrape its values page by page
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      // check job status
      if (!this.job_is_running) break;

      // read a page
      const fetched = await lastValueFrom(
        this.storeClient.send(
          EVENT_NAME_READ_PRODUCTS,
          new ProductReadFiltersEvent({
            page: pageNumber,
            limit: pageSize,
            path: 'products',
          }),
        ),
      );

      const products = fetched.data;
      const totalItems = fetched.meta.totalItems;
      const itemsPerPage = fetched.meta.itemsPerPage;
      const currentPage = fetched.meta.currentPage;
      const totalPages = fetched.meta.totalPages;

      // scrape them
      for (let i = 0; i < products.length; i++) {
        // check job status
        if (!this.job_is_running) break;

        const product = products[i];
        const { id: product_id, external_sellers } = product;
        const scrape = new Scrape({
          session_id,
          total_items: totalItems,
          items_per_page: itemsPerPage,
          page_number: currentPage,
          total_pages: totalPages,
          product_id,
        });

        try {
          const [stockResult, salePriceResult] = await Promise.all([
            this.scrapeHelper.zagorselecReadStock(external_sellers),
            this.scrapeHelper.zagorselecReadSalePrice(external_sellers),
          ]);

          scrape.store_name = stockResult.store_name;
          scrape.store_product_url = stockResult.store_product_url;
          scrape.store_product_id = stockResult.store_product_id;
          scrape.available_quantity = stockResult.available_quantity;
          scrape.sale_price = salePriceResult.sale_price;

          // Send Event To Update Stock
          if (stockResult?.available_quantity) {
            this.storeClient.emit(
              EVENT_NAME_AVAILABLE_QUANTITY_BY_RENEW_PROCESS_UPDATE,
              new AvailableQuantityUpdateByRenewProcessEvent(
                product_id,
                stockResult.available_quantity,
              ),
            );
          }

          // Send Event To Update Sale Price
          if (salePriceResult?.sale_price) {
            const sale_price = +Math.ceil(
              salePriceResult.sale_price / 10,
            ).toFixed();

            this.storeClient.emit(
              EVENT_NAME_PRODUCT_SALE_PRICE_UPDATE,
              new ProductSalePriceUpdateEvent(product_id, sale_price),
            );
          }
        } catch (error) {
          scrape.error_message = error?.message;
        }

        // save the result
        await this.scrapesRepository.create(scrape);
      }
    }

    this.job_is_running = false;
  }
}
