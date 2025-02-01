import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class Label extends AbstractEntity<Label> {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  background_color: string;

  @OneToMany(() => Group, (group) => group.label)
  groups: Group[];
}
