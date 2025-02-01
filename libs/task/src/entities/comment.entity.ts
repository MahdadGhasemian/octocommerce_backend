import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Board } from './board.entity';
import { Content } from './content.entity';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { CommentType } from '../../../common/src/enum/enums';

@Entity()
export class Comment extends AbstractEntity<Comment> {
  @Column({ type: 'enum', enum: CommentType, default: CommentType.COMMENT })
  comment_type: CommentType;

  @OneToOne(() => Content, (content) => content.comment, { cascade: true })
  @JoinColumn()
  content: Content;

  @Column({ nullable: true })
  @Index()
  created_by_user_id: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'created_by_user_id' })
  created_by: User;

  @Column()
  @Index()
  board_id: number;

  @ManyToOne(() => Board, (board) => board.comments)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
