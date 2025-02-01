import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { InventoryType } from '../../../common/src/enum/enums';

@Entity()
export class Inventory extends AbstractEntity<Inventory> {
  @Column()
  @Index()
  inventory_number: number;

  @Column({ type: 'timestamptz' })
  inventory_date: Date;

  @Column({ type: 'enum', enum: InventoryType, default: InventoryType.INPUT })
  @Index()
  inventory_type: InventoryType;

  @Column({ nullable: true })
  inventory_description: string;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.inventory, {
    cascade: true,
  })
  inventory_items: InventoryItem[];

  @Column({ nullable: true })
  @Index()
  created_by_user_id: number;

  @ManyToOne(() => User, (user) => user.created_by_inventories)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;

  @Column({ nullable: true })
  @Index()
  updated_by_user_id: number;

  @ManyToOne(() => User, (user) => user.updated_by_inventories)
  @JoinColumn({ name: 'updated_by_user_id' })
  updated_by: User;
}
