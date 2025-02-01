import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class Test extends AbstractEntity<Test> {
  @Column({ nullable: true })
  text: string;
}
