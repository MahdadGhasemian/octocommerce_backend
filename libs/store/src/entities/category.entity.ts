import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Product } from './product.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { ExternalCategorySeller } from './external-category-seller.entity';

@Entity()
@Tree('nested-set')
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  parent_id: number;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(
    () => ExternalCategorySeller,
    (externalCategorySeller) => externalCategorySeller.category,
    {
      cascade: true,
    },
  )
  external_category_sellers: ExternalCategorySeller[];
}
