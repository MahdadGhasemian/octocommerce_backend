import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { RecommendationType } from '../../../common/src/enum/enums';
@Entity()
export class Review extends AbstractEntity<Review> {
  @Column({ nullable: true })
  title: string;

  @Column()
  content: string;

  @Column({ type: 'int', width: 5, default: 0 })
  rating: number;

  @Column('simple-array', { nullable: true })
  pros: string[];

  @Column('simple-array', { nullable: true })
  cons: string[];

  @Column({ type: 'jsonb', nullable: true })
  images: { url: string; description?: string }[];

  @Column({ type: 'jsonb', nullable: true })
  videos: { url: string; description?: string }[];

  @Column({
    type: 'enum',
    enum: RecommendationType,
    default: RecommendationType.UNKNOWN,
  })
  recommended: RecommendationType;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'boolean', default: false })
  user_has_bought_product: boolean;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  product_code: string;

  @Column()
  @Index()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
