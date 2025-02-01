import { User } from '../entities';

export class UserCreatedEvent {
  constructor(public readonly user: User) {}
}

export class UserUpdatedEvent extends UserCreatedEvent {}
