import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class Wallet extends AbstractEntity<Wallet> {
  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  balance: number;

  @Column({ unique: true })
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.wallets)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
