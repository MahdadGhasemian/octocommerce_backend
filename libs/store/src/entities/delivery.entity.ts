import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { DeliveryStatus, DeliveryType } from '../../../common/src/enum/enums';
import { DeliveryMethod } from './delivery-method.entity';

@Entity()
export class Delivery extends AbstractEntity<Delivery> {
  @Column()
  @Index()
  delivery_method_id: number;

  @ManyToOne(
    () => DeliveryMethod,
    (deliveryMethod) => deliveryMethod.deliveries,
  )
  @JoinColumn({ name: 'delivery_method_id' })
  delivery_method: DeliveryMethod;

  @Column({ nullable: true })
  delivery_method_area_rule_area_name: string;

  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.POST_NORAMAL,
  })
  delivery_type: DeliveryType;

  @Column({ type: 'timestamptz', nullable: true })
  delivery_started_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  delivery_delivered_date: Date;

  @Column({ nullable: true })
  delivery_address: string;

  @Column({ nullable: true })
  delivery_city: string;

  @Column({ nullable: true })
  delivery_postal_code: string;

  @Column({ nullable: true })
  delivery_note: string;

  @Column({ type: 'double precision', nullable: true })
  delivery_latitude: number;

  @Column({ type: 'double precision', nullable: true })
  delivery_longitude: number;

  @Column({ nullable: true })
  driver_name: string;

  @Column({ nullable: true })
  driver_phone_number: string;

  @Column({ nullable: true })
  car_license_plate: string;

  @Column({ nullable: true })
  recipient_name: string;

  @Column({ nullable: true })
  recipient_national_id: string;

  @Column({ nullable: true })
  recipient_phone_number: string;

  @Column({ nullable: true })
  recipient_mobile_phone_number: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  delivery_status: DeliveryStatus;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  confirmation_date: Date;

  @Column({ nullable: true })
  rejected_note: string;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.deliveries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  @Index()
  confirmed_rejected_by_user_id: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'confirmed_rejected_by_user_id' })
  confirmed_rejected_by: User;

  @OneToOne(() => Order, (order) => order.delivery)
  order: Order;
}
