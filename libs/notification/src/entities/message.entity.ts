import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { MessageGroupType, MessageType } from '../../../common/src/enum/enums';

import { User } from './user.entity';

@Entity()
export class Message extends AbstractEntity<Message> {
  @Column({ default: false })
  is_viewed: boolean;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.DEFAULT })
  type: MessageType;

  @Column({
    type: 'enum',
    enum: MessageGroupType,
    default: MessageGroupType.DEFAULT,
  })
  group_type: MessageGroupType;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  body: string;

  @Column('jsonb', { nullable: false, default: {} })
  data: string | object | any;

  @Column()
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
