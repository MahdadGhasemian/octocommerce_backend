import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import {
  DeliveryChargeType,
  DeliveryPricingType,
  DeliveryType,
} from '../../../common/src/enum/enums';
import { Delivery } from './delivery.entity';

export interface DeliveryMethodAreaRule {
  area_name: string;
  price: number;
}

@Entity()
export class DeliveryMethod extends AbstractEntity<DeliveryMethod> {
  @Column({
    type: 'enum',
    enum: DeliveryType,
    default: DeliveryType.POST_NORAMAL,
  })
  delivery_type: DeliveryType;

  @Column({
    type: 'enum',
    enum: DeliveryChargeType,
    default: DeliveryChargeType.PREPAID,
  })
  delivery_charge_type: DeliveryChargeType;

  @Column({
    type: 'enum',
    enum: DeliveryPricingType,
    default: DeliveryPricingType.FIXED,
  })
  delivery_pricing_type: DeliveryPricingType;

  @Column('numeric', { nullable: true, precision: 15, scale: 0, default: 0 })
  fixed_price?: number;

  @Column('numeric', { nullable: true, precision: 15, scale: 0, default: 0 })
  per_kilometer?: number;

  @Column({ type: 'jsonb', default: [] })
  delivery_method_area_rules: DeliveryMethodAreaRule[];

  @Column({ default: false })
  is_enabled: boolean;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Delivery, (delivery) => delivery.delivery_method)
  deliveries: Delivery[];
}
