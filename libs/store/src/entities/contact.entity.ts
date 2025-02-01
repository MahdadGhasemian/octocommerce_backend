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
import { Order } from './order.entity';
import { ContactType } from '../../../common/src/enum';

@Entity()
export class Contact extends AbstractEntity<Contact> {
  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.INDIVIDUAL,
  })
  contact_type: ContactType;

  @Column({ nullable: true })
  title?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  mobile_phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  national_code: string;

  @Column({ nullable: true })
  economic_code: string;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Order, (order) => order.contact)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.contact)
  billing_orders: Order[];
}
