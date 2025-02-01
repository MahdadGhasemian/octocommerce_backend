import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import {
  TransactionNote,
  TransactionType,
} from '../../../common/src/enum/enums';

@Entity()
export class WalletTransaction extends AbstractEntity<WalletTransaction> {
  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionNote,
  })
  transaction_note: TransactionNote;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.walletTransactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.wallet_transactions)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
