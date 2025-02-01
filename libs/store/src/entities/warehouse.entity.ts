import { Column, Entity, OneToMany } from 'typeorm';
import { Stock } from './stock.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity()
export class Warehouse extends AbstractEntity<Warehouse> {
  @Column()
  title: string;

  @Column({ default: false })
  is_virtualy: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.warehouse)
  inventorie_items: InventoryItem[];

  @OneToMany(
    () => InventoryItem,
    (inventoryItem) => inventoryItem.warehouse_from,
  )
  inventorie_items_from: InventoryItem[];

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.warehouse_to)
  inventorie_items_to: InventoryItem[];

  @OneToMany(() => Stock, (stock) => stock.warehouse)
  stocks: Stock[];
}
