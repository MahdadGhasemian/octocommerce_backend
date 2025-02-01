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
import { User } from './user.entity';
import { Project } from './project.entity';
import { Comment } from './comment.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { TaskPriority } from '../../../common/src/enum/enums';
import { Group } from './group.entity';

@Entity()
export class Board extends AbstractEntity<Board> {
  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.LOW })
  priority: TaskPriority;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  board_sequence_number: number;

  @Column({ nullable: true })
  @Index()
  project_id: number;

  @ManyToOne(() => Project, (project) => project.boards)
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ nullable: true })
  @Index()
  group_id: number;

  @ManyToOne(() => Group, (group) => group.boards)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @OneToMany(() => Comment, (comment) => comment.board, { cascade: true })
  comments: Comment[];

  @Column()
  @Index()
  created_by_user_id: number;

  @ManyToOne(() => User, (user) => user.created_by_boards)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;

  @Column({ nullable: true })
  @Index()
  assigned_to_user_id: number;

  @ManyToOne(() => User, (user) => user.assigned_to_boards)
  @JoinColumn({ name: 'assigned_to_user_id' })
  assigned_to: User;

  @ManyToMany(() => User)
  @JoinTable()
  flow_users: User[];
}
