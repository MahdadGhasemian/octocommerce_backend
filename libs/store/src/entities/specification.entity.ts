import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Product } from './product.entity';

@Entity()
export class Specification extends AbstractEntity<Specification> {
  @Column()
  @Index()
  key: string;

  @Column()
  value: string;

  @Column({ nullable: true })
  @Index()
  key_2: string;

  @Column({ nullable: true })
  value_2: string;

  @Column()
  product_id?: number;

  @ManyToOne(() => Product, (product) => product.specifications, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
