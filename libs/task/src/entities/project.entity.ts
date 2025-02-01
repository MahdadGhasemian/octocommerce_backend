import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Board } from './board.entity';
import { User } from './user.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class Project extends AbstractEntity<Project> {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @Column()
  @Index()
  owner_user_id: number;

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'owner_user_id' })
  owned_by: User;

  @OneToMany(() => Board, (board) => board.project)
  boards: Board[];
}
