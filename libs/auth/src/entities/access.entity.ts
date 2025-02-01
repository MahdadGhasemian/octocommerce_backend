import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { Endpoint } from './endpoint.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

export interface AccessInfoEndpoint {
  key: string;
  tag: string;
  get: boolean | null;
  post: boolean | null;
  patch: boolean | null;
  delete: boolean | null;
}

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

  @ManyToMany(() => Endpoint, { cascade: true })
  @JoinTable()
  endpoints: Endpoint[];

  @Column({ type: 'jsonb', nullable: true })
  @Index()
  info_endpoints: AccessInfoEndpoint[];
}
