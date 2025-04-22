import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  sale_price: number;

  @Column()
  quantity: number;

  @Column()
  @Index()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.order_items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: true })
  product_id?: number;

  @ManyToOne(() => Product, (product) => product.order_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
