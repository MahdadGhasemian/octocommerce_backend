import { AbstractEntity } from '../database';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Gender } from '../enum';
import { Access } from './access.entity';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ unique: true })
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

  @Column()
  hashed_password: string;

  @Column({ default: false })
  created_by_system: boolean;

  @Column({ default: false })
  need_to_set_name: boolean;

  @ManyToMany(() => Access)
  @JoinTable()
  accesses: Access[];
}
