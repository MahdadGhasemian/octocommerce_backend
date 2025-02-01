import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity()
export class Answer extends AbstractEntity<Answer> {
  @Column({ nullable: true, type: 'text' })
  answer_text: string;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.answers)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  @Index()
  question_id: number;

  @ManyToOne(() => Question, (question) => question.answers)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}
