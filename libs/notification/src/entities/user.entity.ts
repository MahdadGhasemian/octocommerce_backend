import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';
import { Message } from './message.entity';
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

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
