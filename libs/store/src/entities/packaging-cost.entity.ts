import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class PackagingCost extends AbstractEntity<PackagingCost> {
  @Column()
  title: string;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  cost: number;

  @Column({ default: false })
  shared_packaging: boolean;

  @OneToMany(() => Product, (product) => product.packaging_cost)
  product_packaging_costs: Product[];
}
