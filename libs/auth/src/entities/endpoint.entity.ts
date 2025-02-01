import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Endpoint extends AbstractEntity<Endpoint> {
  @Column()
  tag: string;

  @Column()
  path: string;

  @Column()
  method: string;
}
