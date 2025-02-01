import { AbstractEntity } from '../database';
import { Column, Entity } from 'typeorm';

@Entity()
export class Access extends AbstractEntity<Access> {
  @Column()
  title: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: false })
  cannot_be_deleted: boolean;

  @Column({ default: false })
  has_full_access: boolean;

  @Column({ default: false })
  is_internal_user: boolean;

  @Column({ default: false })
  notification_order_created: boolean;

  @Column({ default: false })
  notification_payment_created: boolean;

  @Column({ default: false })
  notification_delivery_created: boolean;
}
