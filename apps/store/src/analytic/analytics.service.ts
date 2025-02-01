import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { ProductsRepository } from '../products/products.repository';
import { endOfWeek, subWeeks } from 'date-fns';
import { StocksRepository } from '../inventory/stocks.repository';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly stocksRepository: StocksRepository,
  ) {}

  async stats() {
    const weekStartsOn = 6;
    const oneWeekAgoEnd = endOfWeek(subWeeks(new Date(), 1), {
      weekStartsOn,
    });

    const [totalUser, totalProduct, totalOrder] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
    ]);

    return {
      user: {
        total: totalUser,
      },
      product: {
        total: totalProduct,
      },
      order: {
        total: totalOrder,
        new: {
          value: 0,
          until: oneWeekAgoEnd.toISOString(),
          percentageChangeOneWeek: 0,
        },
      },
      sale: {
        total: 0,
        new: {
          totalSale: 0,
          percentageChangeOneMonth: 0,
        },
      },
      stockInfo: [],
    };
  }
}
