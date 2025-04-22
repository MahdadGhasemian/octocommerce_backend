import { Column, Entity, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { Delivery } from './delivery.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Review } from './review.entity';
import { Question } from './question.entity';
import { Answer } from './answer.entity';
import { Contact } from './contact.entity';
import { ShortMessage } from './short-message.entity';
import { Gender } from '../../../common/src/enum/enums';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ nullable: true })
  mobile_phone: string;

  @Column({ default: false })
  mobile_phone_is_verified: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  email_is_verified: boolean;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNKNOWN })
  gender: Gender;

  @Column({ default: false })
  created_by_system: boolean;

  @Column({ default: false })
  need_to_set_name: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.confirmed_rejected_by)
  confirmed_rejected_orders: Order[];

  @OneToMany(() => Delivery, (delivery) => delivery.user)
  deliveries: Delivery[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  @OneToMany(() => ShortMessage, (sortMessage) => sortMessage.user)
  short_messages: ShortMessage[];
}
