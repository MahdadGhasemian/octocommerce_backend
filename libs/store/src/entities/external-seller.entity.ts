import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Product } from './product.entity';

@Entity()
export class ExternalSeller extends AbstractEntity<ExternalSeller> {
  @Column()
  @Index()
  store_name: string;

  @Column()
  @Index()
  store_product_url: string;

  @Column()
  @Index()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.external_sellers, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
