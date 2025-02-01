import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Inventory } from './inventory.entity';
import { Product } from './product.entity';
import { OrderItem } from './order-item.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { MaterialUnit, OperatorType } from '../../../common/src/enum/enums';
import { Stock } from './stock.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
export class InventoryItem extends AbstractEntity<InventoryItem> {
  @Column({ type: 'enum', enum: MaterialUnit, default: MaterialUnit.DEVICE })
  unit: MaterialUnit;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: OperatorType,
    default: OperatorType.POSITIVE,
  })
  @Index()
  operator_type: OperatorType;

  @Column()
  @Index()
  warehouse_id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventorie_items)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ nullable: true })
  @Index()
  warehouse_from_id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventorie_items_from)
  @JoinColumn({ name: 'warehouse_from_id' })
  warehouse_from: Warehouse;

  @Column({ nullable: true })
  @Index()
  warehouse_to_id: number;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.inventorie_items_to)
  @JoinColumn({ name: 'warehouse_to_id' })
  warehouse_to: Warehouse;

  @Column()
  @Index()
  inventory_id: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.inventory_items)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column()
  @Index()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.inventory_items)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  @Index()
  order_item_id: number;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.inventory_items)
  @JoinColumn({ name: 'order_item_id' })
  order_item: OrderItem;

  @OneToOne(() => Stock, (stock) => stock.inventory_item, { cascade: true })
  @JoinColumn()
  stock: Stock;
}
