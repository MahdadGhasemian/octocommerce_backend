import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question extends AbstractEntity<Question> {
  @Column({ nullable: true, type: 'text' })
  question_text: string;

  @Column({ type: 'boolean', default: false })
  user_has_bought_product: boolean;

  @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
  answers: Answer[];

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  product_code: string;

  @Column()
  @Index()
  product_id: number;

  @ManyToOne(() => Product, (product) => product.questions)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
