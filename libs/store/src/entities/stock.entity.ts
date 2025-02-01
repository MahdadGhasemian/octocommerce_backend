import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Product } from './product.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity()
export class Stock extends AbstractEntity<Stock> {
  @Column()
  quantity: number;

  @Column({ default: 0 })
  available_quantity: number;

  @Column()
  @Index()
  warehouse_id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.stocks)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column()
  @Index()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.stocks)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(() => InventoryItem, (inventoryItem) => inventoryItem.stock)
  inventory_item: InventoryItem;
}
