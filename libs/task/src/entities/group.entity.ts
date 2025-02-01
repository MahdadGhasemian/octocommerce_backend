import {
  Column,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Label } from './label.entity';
import { Board } from './board.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Content } from './content.entity';

@Entity()
export class Group extends AbstractEntity<Group> {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  @Generated('increment')
  sequence_number: number;

  @Column({})
  @Index()
  label_id: number;

  @ManyToOne(() => Label, (label) => label.groups)
  @JoinColumn({ name: 'label_id' })
  label: Label;

  @OneToMany(() => Board, (board) => board.group)
  boards: Board[];

  @OneToMany(() => Content, (content) => content.group)
  contents: Content[];
}
