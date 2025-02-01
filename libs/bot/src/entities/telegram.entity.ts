import { Entity } from 'typeorm';
import { AbstractEntity } from '../../../common/src/database/abstract.entity';

@Entity()
export class Telegram extends AbstractEntity<Telegram> {}
