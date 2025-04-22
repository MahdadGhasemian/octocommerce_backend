import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { ProductType, MaterialUnit } from '../../../common/src/enum/enums';
import { Review } from './review.entity';
import { Question } from './question.entity';
import { Specification } from './specification.entity';
import { ExternalSeller } from './external-seller.entity';
import { PackagingCost } from './packaging-cost.entity';

@Entity()
export class Product extends AbstractEntity<Product> {
  @Column({ nullable: true })
  @Index()
  product_code: string;

  @Column()
  @Index()
  name: string;

  @Column()
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column('varchar', { array: true, nullable: true })
  images?: string[];

  @Column({ nullable: true })
  datasheet?: string;

  @Column({ nullable: true })
  part_number?: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.UNKNOWN })
  product_type: ProductType;

  @Column('jsonb', { nullable: false, default: [] })
  keywords: string[];

  @Column({ default: 0 })
  available_quantity: number;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  sale_price: number;

  @Column('numeric', { precision: 5, scale: 2, default: 0 })
  discount_percentage: number;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  discount_amount: number;

  @Column('numeric', { precision: 15, scale: 6, default: 1 })
  price_scale_value: number;

  @Column({ default: true })
  is_scalable_price: boolean;

  @Column({ type: 'enum', enum: MaterialUnit, default: MaterialUnit.DEVICE })
  unit: MaterialUnit;

  @Column({ default: false })
  is_active: boolean;

  @Column({ default: false })
  is_online_payment_allowed: boolean;

  @Column({ nullable: true })
  category_id?: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  order_items: OrderItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Question, (question) => question.product)
  questions: Question[];

  @OneToMany(() => Specification, (specification) => specification.product, {
    cascade: true,
  })
  specifications: Specification[];

  @OneToMany(() => ExternalSeller, (externalSeller) => externalSeller.product, {
    cascade: true,
  })
  external_sellers: ExternalSeller[];

  @Column({ nullable: true })
  packaging_cost_id?: number;

  @ManyToOne(
    () => PackagingCost,
    (packagingCost) => packagingCost.product_packaging_costs,
  )
  @JoinColumn({ name: 'packaging_cost_id' })
  packaging_cost: PackagingCost;
}
