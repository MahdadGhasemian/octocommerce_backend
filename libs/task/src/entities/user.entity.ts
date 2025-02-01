import { Column, Entity, OneToMany } from 'typeorm';
import { Board } from './board.entity';
import { Project } from './project.entity';
import { Comment } from './comment.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Content } from './content.entity';
import { Gender } from '../../../common/src/enum/enums';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ nullable: true })
  mobile_phone: string;

  @Column({ default: false })
  mobile_phone_is_verified: boolean;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  email_is_verified: boolean;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNKNOWN })
  gender: Gender;

  @Column({ default: false })
  created_by_system: boolean;

  @Column({ default: false })
  need_to_set_name: boolean;

  @OneToMany(() => Board, (board) => board.created_by)
  created_by_boards: Board[];

  @OneToMany(() => Board, (board) => board.assigned_to)
  assigned_to_boards: Board[];

  @OneToMany(() => Project, (project) => project.owned_by)
  projects: Project[];

  @OneToMany(() => Comment, (comment) => comment.created_by)
  comments: Comment[];

  @OneToMany(() => Content, (content) => content.user)
  contents: Content[];
}
