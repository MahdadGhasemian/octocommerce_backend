import { ExternalSeller } from '@app/store';
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScrapeHelper {
  protected readonly logger = new Logger(ScrapeHelper.name);

  constructor(
    private readonly zagroselecStoreKeyName: string,
    private readonly zagroselecStoreTargetBaseUrl: string,
    private readonly zagroselecStoreStockTargetBaseUrl: string,
  ) {}

  public async zagorselecReadStock(external_sellers: ExternalSeller[]) {
    const store_name = this.zagroselecStoreKeyName;

    const external_seller = external_sellers.find(
      (seller) => seller.store_name === store_name,
    );
    const { store_product_url } = external_seller;
    const store_product_id =
      this.zagorselecGetLastNumberFromURL(store_product_url);

    const url = `${this.zagroselecStoreStockTargetBaseUrl}?productid=${store_product_id}`;

    // Extract Product Data
    const available_quantity =
      await this.zagorselecExtractStockQuantityFromUrl(url);

    return {
      store_name,
      store_product_url,
      store_product_id,
      available_quantity,
    };
  }

  public async zagorselecReadSalePrice(external_sellers: ExternalSeller[]) {
    const store_name = this.zagroselecStoreKeyName;

    const external_seller = external_sellers.find(
      (seller) => seller.store_name === store_name,
    );
    const { store_product_url } = external_seller;
    const store_product_id =
      this.zagorselecGetLastNumberFromURL(store_product_url);

    const url = `${this.zagroselecStoreTargetBaseUrl}${store_product_id}`;

    // Extract Product Data
    const sale_price = await this.zagorselecExtractPriceFromUrl(url);

    return {
      store_name,
      store_product_url,
      store_product_id,
      sale_price,
    };
  }

  private zagorselecGetLastNumberFromURL(url: string) {
    const match = url.match(/(\d+)$/);
    return match ? match[0] : null;
  }

  private async zagorselecExtractStockQuantityFromUrl(url: string) {
    // fetch html data
    const response = await axios.get(url);
    const htmlContent = response.data;

    return this.zagorselecExtractStockQuantity(htmlContent);
  }

  private async zagorselecExtractPriceFromUrl(url: string) {
    // fetch html data
    const response = await axios.get(url);
    const htmlContent = response.data;

    // Run all extraction functions in parallel
    return await this.zagorselecExtractPrice(htmlContent);
  }

  // Extract Stock Quantity
  private async zagorselecExtractStockQuantity(htmlContent: string) {
    const $ = cheerio.load(htmlContent);

    const inventoryValue = parseFloat($('#Inventory').attr('value'));
    const inventoryValueAsInt = Math.round(inventoryValue);

    return inventoryValueAsInt;
  }

  // Extract Price
  private async zagorselecExtractPrice(htmlContent: string) {
    const $ = cheerio.load(htmlContent);

    const price = $('#add_cart_desk_mode text').text().trim();

    return +price;
  }
}
