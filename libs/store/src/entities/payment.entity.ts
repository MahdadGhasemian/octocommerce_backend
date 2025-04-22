import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { PaymentStatus, PaymentType } from '../../../common/src/enum/enums';

export interface PaymentProviderDataInterface {
  amount: number;
  payment_amount: number;
  return_url: string;
  user_mobile_phone?: string;
  payment_order_id: string;
  token: string;
  hashed_card_number?: string;
  transaction_id?: string;
  card_pin?: string;
  retrival_ref_number?: string;
}

@Entity()
export class Payment extends AbstractEntity<Payment> {
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  payment_status: PaymentStatus;

  @Column({ type: 'enum', enum: PaymentType, default: PaymentType.RECEIPT })
  payment_type: PaymentType;

  @Column({ unique: true })
  payment_order_id: string;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  amount: number;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  payment_amount: number;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ nullable: true })
  attach_url: string;

  @Column({ nullable: true })
  rejected_note: string;

  @Column({ type: 'jsonb', nullable: true })
  payment_provider_data: PaymentProviderDataInterface;

  @Column()
  order_id: number;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  @Index()
  confirmed_rejected_by_user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'confirmed_rejected_by_user_id' })
  confirmed_rejected_by: User;
}
