import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class Scrape extends AbstractEntity<Scrape> {
  @Column()
  session_id: string;

  @Column({ nullable: true })
  total_items: number;

  @Column({ nullable: true })
  items_per_page: number;

  @Column({ nullable: true })
  page_number: number;

  @Column({ nullable: true })
  total_pages: number;

  @Column({ nullable: true })
  product_id: number;

  @Column({ nullable: true })
  store_name: string;

  @Column({ nullable: true })
  store_product_url: string;

  @Column({ nullable: true })
  store_product_id: string;

  @Column({ nullable: true })
  available_quantity: number;

  @Column({ nullable: true })
  sale_price: number;

  @Column({ nullable: true })
  error_message: string;
}
