import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { BonusType } from '../../../common/src/enum/enums';

@Entity()
export class Bonus extends AbstractEntity<Bonus> {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: BonusType, default: BonusType.PERCENTAGE })
  bonus_type: BonusType;

  @Column('numeric', { precision: 15, scale: 0, nullable: true })
  constant_amount: number;

  @Column('numeric', { precision: 5, scale: 2, nullable: true })
  percentage_amount: number;

  @Column({ default: true })
  is_enabled: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @ManyToMany(() => User)
  @JoinTable()
  allowed_users: User[];

  @ManyToMany(() => Product)
  @JoinTable()
  allowed_products: Product[];
}
