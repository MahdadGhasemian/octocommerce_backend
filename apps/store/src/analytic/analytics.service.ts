import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { OrdersRepository } from '../orders/orders.repository';
import { ProductsRepository } from '../products/products.repository';
import { endOfWeek, subWeeks } from 'date-fns';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) { }

  async stats() {
    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(currentDate);
    endDate.setHours(23, 59, 59, 999);

    const weekStartsOn = 6;
    const oneWeekAgoEnd = endOfWeek(subWeeks(currentDate, 1), {
      weekStartsOn,
    });

    const [totalUser, totalProduct, totalOrder, newOrder] = await Promise.all([
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.ordersRepository.count(),
      this.ordersRepository.countBy({
        created_at: MoreThanOrEqual(oneWeekAgoEnd),
      }),
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
          value: newOrder,
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
    };
  }
}
