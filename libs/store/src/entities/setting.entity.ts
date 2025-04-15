import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Setting extends AbstractEntity<Setting> {
  @Column('numeric', { default: 0 })
  invoice_number_pre_part: number;

  @Column('numeric', { default: 0 })
  invoice_number_multiple: number;

  @Column('numeric', { default: 0 })
  tax_rate_default: number;

  @Column('numeric', { precision: 15, scale: 0, default: 0 })
  base_price_scale_amount: number;

  @Column({ type: 'double precision', nullable: true })
  delivery_center_latitude: number;

  @Column({ type: 'double precision', nullable: true })
  delivery_center_longitude: number;

  @Column({ nullable: true })
  product_code_prefix: string;
}
