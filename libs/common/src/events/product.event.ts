import { PaginateQuery } from 'nestjs-paginate';

export class ProductReadFiltersEvent {
  constructor(public readonly query: PaginateQuery) {}
}

export class ProductSalePriceUpdateEvent {
  constructor(
    public readonly product_id: number,
    public readonly sale_price: number,
  ) {}
}
