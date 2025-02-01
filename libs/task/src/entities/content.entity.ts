import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Comment } from './comment.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { ContentType } from '../../../common/src/enum/enums';
import { Group } from './group.entity';
import { User } from './user.entity';

@Entity()
export class Content extends AbstractEntity<Content> {
  @Column({
    type: 'enum',
    enum: ContentType,
    default: ContentType.USER_COMMENT,
  })
  content_type: ContentType;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  content_follow: string;

  @OneToOne(() => Comment, (comment) => comment.content)
  comment: Comment;

  @Column({ nullable: true })
  @Index()
  group_id: number;

  @ManyToOne(() => Group, (group) => group.boards)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ nullable: true })
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.contents)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
