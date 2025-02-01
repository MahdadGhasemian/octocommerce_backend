import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { SmsTitleType } from '../../../common/src/enum/enums';
import { User } from './user.entity';

@Entity()
export class ShortMessage extends AbstractEntity<ShortMessage> {
  @Column()
  mobile_phone: string;

  @Column({
    type: 'enum',
    enum: SmsTitleType,
  })
  title_type: SmsTitleType;

  @Column({ type: 'jsonb', nullable: true })
  text_list: string[];

  @Column()
  is_sent_by_system: boolean;

  @Column({ nullable: true })
  @Index()
  user_id: number;

  @ManyToOne(() => User, (user) => user.short_messages)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
