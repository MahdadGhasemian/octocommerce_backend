import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { InventoryItem } from './inventory-item.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { BonusType } from '../../../common/src/enum/enums';

export interface BonusDataInterface {
  bonus_id: number;
  bonus_title: string;
  bonus_type: BonusType;
  bonus_constant_amount: number;
  bonus_percentage_amount: number;
  profit_amount: number;
}

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  sale_price: number;

  @Column()
  quantity: number;

  @Column({ type: 'jsonb', nullable: true })
  bonus_data: BonusDataInterface;

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

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.order_item)
  inventory_items: InventoryItem[];
}
