import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Category } from './category.entity';

@Entity()
export class ExternalCategorySeller extends AbstractEntity<ExternalCategorySeller> {
  @Column()
  store_name: string;

  @Column()
  store_category_url: string;

  @Column()
  store_category_english_name: string;

  @Column()
  store_category_persian_name: string;

  @Column()
  @Index()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.external_category_sellers, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
